/*
 * Python runner. Pyodide is Python compiled to WebAssembly, so it runs inside the visitor's browser.
 * Nothing is sent to a server. Only the Python standard library is available (no pip installs).
 * It lives in a Web Worker so the page stays smooth, and the page can stop it if it runs too long.
 */
const PYODIDE_VERSION = '0.26.4';
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

importScripts(`${PYODIDE_URL}pyodide.js`);

let pyodide = null;
let currentId = null;

async function init() {
  try {
    pyodide = await loadPyodide({ indexURL: PYODIDE_URL });
    pyodide.setStdout({ batched: (text) => self.postMessage({ id: currentId, type: 'stdout', text }) });
    pyodide.setStderr({ batched: (text) => self.postMessage({ id: currentId, type: 'stderr', text }) });
    try {
      pyodide.setStdin({ error: true }); // input() is not supported here
    } catch (_) {
      /* older Pyodide versions do not have this option */
    }

    // Best effort: after loading, switch off network access for the visitor's code.
    ['fetch', 'XMLHttpRequest', 'WebSocket'].forEach((name) => {
      try {
        Object.defineProperty(self, name, { value: undefined, writable: true, configurable: true });
      } catch (_) {
        /* ignore */
      }
    });

    self.postMessage({ type: 'ready' });
  } catch (err) {
    self.postMessage({ type: 'init-error', error: String(err && err.message ? err.message : err) });
  }
}

const ready = init();

// Show only the lines that belong to the visitor's program, not Pyodide's internal frames.
function cleanTraceback(message) {
  const lines = String(message).split('\n');
  const start = lines.findIndex((l) => l.includes('File "<exec>"'));
  return start >= 0 ? ['Traceback (most recent call last):', ...lines.slice(start)].join('\n').trim() : String(message).trim();
}

self.onmessage = async (event) => {
  const { id, code } = event.data || {};
  await ready;
  if (!pyodide) return;
  currentId = id;

  const namespace = pyodide.globals.get('dict')(); // a fresh, empty Python world for every run
  try {
    await pyodide.runPythonAsync(code, { globals: namespace });
    self.postMessage({ id, type: 'done' });
  } catch (err) {
    self.postMessage({ id, type: 'error', text: cleanTraceback(err && err.message ? err.message : err) });
  } finally {
    namespace.destroy();
  }
};
