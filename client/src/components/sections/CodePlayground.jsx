import { useCallback, useEffect, useRef, useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import SectionHead from '../ui/SectionHead.jsx';
import { PlayIcon } from '../ui/Icons.jsx';
import useInView from '../../hooks/useInView.js';
import { LANGUAGES, PROGRAMS } from '../../data/programs.js';
import {
  cancelJavaScript,
  cancelPython,
  runJavaScript,
  runPython,
  subscribePythonStatus,
  warmUpPython,
} from '../../services/codeRunner.js';

const MAX_LINES = 400; // keep the output small so the page stays fast

const PY_STATUS_TEXT = {
  idle: 'Python starts the first time you press Run.',
  loading: 'Starting Python in your browser (first time only, about 10 seconds)...',
  ready: 'Python is ready.',
  error: 'Python could not start. Check your internet connection and press Run to try again.',
};

export default function CodePlayground() {
  const [language, setLanguage] = useState('python');
  const [programId, setProgramId] = useState(PROGRAMS.python[0].id);
  const [edits, setEdits] = useState({}); // the visitor's changes, kept per program
  const [output, setOutput] = useState([]);
  const [running, setRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState('idle');
  const [sectionRef, inView] = useInView({ threshold: 0.05, rootMargin: '300px 0px' });
  const consoleRef = useRef(null);

  const programs = PROGRAMS[language];
  const program = programs.find((item) => item.id === programId) || programs[0];
  const code = edits[program.id] ?? program.code;

  useEffect(() => subscribePythonStatus(setPyStatus), []);

  // Start loading Python a little before the visitor reaches the playground (unless Data Saver is on).
  useEffect(() => {
    const saveData = navigator.connection && navigator.connection.saveData;
    if (inView && !saveData) warmUpPython();
  }, [inView]);

  // Keep the newest output line in view.
  useEffect(() => {
    const element = consoleRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [output]);

  const stopRunning = () => {
    cancelPython();
    cancelJavaScript();
  };

  const handleRun = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setOutput([]);

    let count = 0;
    const onOutput = (type, text) => {
      count += 1;
      if (count > MAX_LINES + 1) return;
      const line =
        count === MAX_LINES + 1
          ? { type: 'warn', text: `(Output stopped after ${MAX_LINES} lines.)` }
          : { type, text: String(text).slice(0, 2000) };
      setOutput((lines) => [...lines, line]);
    };

    try {
      if (language === 'python') await runPython(code, { onOutput });
      else await runJavaScript(code, { onOutput });
    } finally {
      setRunning(false);
    }
  }, [running, language, code]);

  const handleReset = () => {
    if (running) stopRunning();
    setEdits((current) => {
      const next = { ...current };
      delete next[program.id];
      return next;
    });
    setOutput([]);
  };

  const switchLanguage = (next) => {
    if (next === language) return;
    if (running) stopRunning();
    setLanguage(next);
    setProgramId(PROGRAMS[next][0].id);
    setOutput([]);
  };

  const chooseProgram = (id) => {
    if (id === program.id) return;
    if (running) stopRunning();
    setProgramId(id);
    setOutput([]);
  };

  const onEditorKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      handleRun();
    }
  };

  const highlight = (value) => {
    const grammar = Prism.languages[language];
    if (!grammar) return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return Prism.highlight(value, grammar, language);
  };

  return (
    <section className="section section-soft" id="playground" ref={sectionRef} aria-labelledby="playground-title">
      <div className="wrap">
        <SectionHead id="playground-title" title="Try real automation code in your browser">
          No install and no sign-up. Pick a small program, press Run and see the result. This is the kind of helper we build to save your team time.
        </SectionHead>

        <div className="pg">
          <div className="pg-controls">
            <div className="lang-switch" role="group" aria-label="Programming language">
              {LANGUAGES.map((item) => (
                <button key={item.id} type="button" aria-pressed={item.id === language} onClick={() => switchLanguage(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="pg-programs" role="group" aria-label="Choose a program">
              {programs.map((item) => (
                <button key={item.id} type="button" className="pg-chip" aria-pressed={item.id === program.id} onClick={() => chooseProgram(item.id)}>
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          <div className="pg-grid">
            <div className="pg-panel">
              <div className="pg-bar">
                <span className="pg-file">{program.file}</span>
                <div className="pg-actions">
                  <button type="button" className="pg-btn pg-run" onClick={handleRun} disabled={running}>
                    <PlayIcon />
                    {running ? 'Running...' : 'Run code'}
                  </button>
                  <button type="button" className="pg-btn pg-reset" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </div>
              <label className="sr-only" htmlFor="pg-editor">
                Code editor for {program.file}
              </label>
              <div className="pg-editor-wrap">
                <Editor
                  value={code}
                  onValueChange={(value) => setEdits((current) => ({ ...current, [program.id]: value }))}
                  highlight={highlight}
                  padding={16}
                  tabSize={4}
                  insertSpaces
                  textareaId="pg-editor"
                  className="pg-editor"
                  style={{ fontFamily: 'var(--f-mono)', fontSize: 14, lineHeight: 1.65 }}
                  onKeyDown={onEditorKeyDown}
                />
              </div>
              <p className="pg-hint">Edit the code if you like. Press Ctrl+Enter (Cmd+Enter on Mac) to run. Press Esc to leave the editor with your keyboard.</p>
            </div>

            <div className="pg-panel">
              <div className="pg-bar">
                <span className="pg-file">Output</span>
                {language === 'python' && <span className="pg-status">{PY_STATUS_TEXT[pyStatus]}</span>}
              </div>
              <div className="pg-console" ref={consoleRef} role="log" tabIndex={0} aria-label="Program output">
                {output.length === 0 ? (
                  <p className="pg-empty">
                    Press <strong>Run code</strong> to see the result here.
                  </p>
                ) : (
                  output.map((line, i) => (
                    <div key={i} className={`pg-line pg-${line.type}`}>
                      {line.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="usecase">
            <div>
              <h3>The problem</h3>
              <p>{program.problem}</p>
            </div>
            <div>
              <h3>What this program does</h3>
              <p>{program.does}</p>
            </div>
            <div>
              <h3>What it means for your business</h3>
              <p>{program.benefit}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
