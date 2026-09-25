/*
 * Sandboxed JavaScript runner.
 *
 * The visitor's code runs inside this Web Worker, which means:
 *  - it has no access to the page (no DOM, no cookies, no localStorage);
 *  - it runs on its own thread, and the page stops it after a time limit (see codeRunner.js);
 *  - network and storage APIs are switched off below, so a program cannot send data anywhere.
 * The only thing it can do is print text with console.log.
 */
'use strict';

const post = self.postMessage.bind(self);

// Switch off anything that could talk to the network or store data.
['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts', 'indexedDB', 'caches', 'BroadcastChannel', 'SharedWorker', 'Worker'].forEach(
  (name) => {
    try {
      Object.defineProperty(self, name, { value: undefined, writable: false, configurable: false });
    } catch (_) {
      /* some browsers do not allow this, the time limit still protects the page */
    }
  }
);

function show(value) {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`;
  if (typeof value === 'symbol' || typeof value === 'bigint') return String(value);
  if (value === undefined) return 'undefined';
  try {
    return JSON.stringify(value, null, 2);
  } catch (_) {
    return String(value);
  }
}

const line = (type) => (...args) => post({ type, text: args.map(show).join(' ') });

const sandboxConsole = {
  log: line('log'),
  info: line('log'),
  debug: line('log'),
  warn: line('warn'),
  error: line('error'),
  table: (data) => post({ type: 'log', text: show(data) }),
};

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

self.onmessage = async (event) => {
  const { code } = event.data || {};
  try {
    // "await" works at the top level of the visitor's code.
    const program = new AsyncFunction('console', `"use strict";\n${code}`);
    await program(sandboxConsole);
    post({ type: 'done' });
  } catch (err) {
    const message = err && err.name === 'EvalError'
      ? 'This browser or website setting does not allow running code here.'
      : `${(err && err.name) || 'Error'}: ${(err && err.message) || err}`;
    post({ type: 'error', text: message });
    post({ type: 'done', failed: true });
  }
};
