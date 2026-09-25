/*
 * Runs the visitor's code in Web Workers (see public/workers/).
 *  - Python:     Pyodide (Python compiled to WebAssembly). The first start takes a few seconds.
 *  - JavaScript: a locked-down worker with no network, no page access and a time limit.
 * Both report output line by line through onOutput(type, text).
 * type is one of: "stdout", "stderr", "warn", "error".
 */
const BASE = import.meta.env?.BASE_URL ?? '/';
const PY_WORKER_URL = `${BASE}workers/pyodide-worker.js`;
const JS_WORKER_URL = `${BASE}workers/js-worker.js`;

/* ------------------------------ Python ------------------------------ */

let pyWorker = null;
let pyReady = null;
let pySeq = 0;
let pyStatus = 'idle'; // idle | loading | ready | error
const pyListeners = new Map(); // run id -> message handler
const statusSubscribers = new Set();

function setPyStatus(status) {
  pyStatus = status;
  statusSubscribers.forEach((fn) => fn(status));
}

export function subscribePythonStatus(fn) {
  statusSubscribers.add(fn);
  fn(pyStatus);
  return () => {
    statusSubscribers.delete(fn);
  };
}

function stopPython() {
  if (pyWorker) pyWorker.terminate();
  pyWorker = null;
  pyReady = null;
  // Let any run that is waiting know it was cancelled.
  pyListeners.forEach((handler) => handler({ type: 'cancelled' }));
  pyListeners.clear();
}

function startPython() {
  setPyStatus('loading');
  const worker = new Worker(PY_WORKER_URL);
  pyWorker = worker;
  pyReady = new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      const message = event.data || {};
      if (message.type === 'ready') {
        setPyStatus('ready');
        resolve();
      } else if (message.type === 'init-error') {
        reject(new Error(message.error || 'Could not start the Python engine.'));
      } else if (pyListeners.has(message.id)) {
        pyListeners.get(message.id)(message);
      }
    };
    worker.onerror = (event) => reject(new Error(event.message || 'The Python engine stopped unexpectedly.'));
  });
  pyReady.catch(() => {
    if (pyWorker === worker) stopPython();
    setPyStatus('error');
  });
  return pyReady;
}

// Start loading Python early (for example when the playground scrolls into view).
export function warmUpPython() {
  if (!pyWorker) startPython().catch(() => {});
  return pyReady;
}

export function cancelPython() {
  stopPython();
  setPyStatus('idle');
}

export async function runPython(code, { onOutput, timeoutMs = 8000 } = {}) {
  if (!pyWorker) startPython().catch(() => {});
  try {
    await pyReady;
  } catch (err) {
    onOutput?.('error', `${err.message}\nCheck your internet connection and try again.`);
    return { ok: false };
  }

  return new Promise((resolve) => {
    const id = ++pySeq;
    let timer = null;
    const finish = (result) => {
      clearTimeout(timer);
      pyListeners.delete(id);
      resolve(result);
    };

    pyListeners.set(id, (message) => {
      if (message.type === 'stdout') onOutput?.('stdout', message.text);
      else if (message.type === 'stderr') onOutput?.('stderr', message.text);
      else if (message.type === 'error') {
        onOutput?.('error', message.text);
        finish({ ok: false });
      } else if (message.type === 'done') finish({ ok: true });
      else if (message.type === 'cancelled') finish({ ok: false, cancelled: true });
    });

    // A program stuck in an endless loop cannot be interrupted, so we stop the worker and start a fresh one next time.
    timer = setTimeout(() => {
      onOutput?.('error', `Stopped: the program ran for more than ${timeoutMs / 1000} seconds. It may be stuck in an endless loop.`);
      pyListeners.delete(id);
      stopPython();
      setPyStatus('idle');
      resolve({ ok: false, timedOut: true });
    }, timeoutMs);

    pyWorker.postMessage({ id, code });
  });
}

/* ---------------------------- JavaScript ---------------------------- */

let cancelCurrentJs = null;

export function cancelJavaScript() {
  if (cancelCurrentJs) cancelCurrentJs();
}

export function runJavaScript(code, { onOutput, timeoutMs = 5000 } = {}) {
  return new Promise((resolve) => {
    const worker = new Worker(JS_WORKER_URL);
    let settled = false;
    let timer = null;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      cancelCurrentJs = null;
      resolve(result);
    };

    timer = setTimeout(() => {
      onOutput?.('error', `Stopped: the program ran for more than ${timeoutMs / 1000} seconds.`);
      finish({ ok: false, timedOut: true });
    }, timeoutMs);

    worker.onmessage = (event) => {
      const message = event.data || {};
      if (message.type === 'log') onOutput?.('stdout', message.text);
      else if (message.type === 'warn') onOutput?.('warn', message.text);
      else if (message.type === 'error') onOutput?.('error', message.text);
      else if (message.type === 'done') finish({ ok: !message.failed });
    };
    worker.onerror = (event) => {
      onOutput?.('error', event.message || 'Something went wrong while running the program.');
      finish({ ok: false });
    };

    cancelCurrentJs = () => finish({ ok: false, cancelled: true });
    worker.postMessage({ code });
  });
}
