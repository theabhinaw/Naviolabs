import { useEffect, useRef, useState } from 'react';
import SectionHead from '../ui/SectionHead.jsx';
import { CheckIcon, SendIcon } from '../ui/Icons.jsx';
import { PRESETS, buildReply, parseEnquiry } from '../../utils/enquiryParser.js';
import { formatInr, truncate } from '../../utils/format.js';

// The four stages. "ms" is how long each one takes in the demo.
const STAGES = [
  { title: 'Input received', ms: 900 },
  { title: 'AI parses intent', ms: 1500 },
  { title: 'Record saved in Google Sheet', ms: 1200 },
  { title: 'Automated WhatsApp reply sent', ms: 1300 },
];
const IDLE_TEXT = [
  'Waits for a customer message.',
  'Works out what the customer wants.',
  'Adds the enquiry to your sheet.',
  'Answers the customer straight away.',
];
const ACTIVE_TEXT = ['Message arriving...', 'AI is reading the message...', 'Saving a new row...', 'Sending the reply...'];
const DONE_TEXT = ['Message received.', 'Understood.', 'Saved.', 'Reply sent.'];

let nextId = 0;
const clock = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

function StageDetail({ index, parsed, received, rows, reply }) {
  if (index === 0) {
    return (
      <dl className="facts">
        <dt>Channel</dt>
        <dd>WhatsApp</dd>
        <dt>Received at</dt>
        <dd>{received}</dd>
        <dt>Message</dt>
        <dd>{truncate(parsed.text, 90)}</dd>
      </dl>
    );
  }
  if (index === 1) {
    return (
      <dl className="facts">
        <dt>Wants</dt>
        <dd>{parsed.intent}</dd>
        <dt>Urgency</dt>
        <dd>{parsed.urgency}</dd>
        <dt>Budget</dt>
        <dd>{parsed.budget ? formatInr(parsed.budget) : 'Not mentioned'}</dd>
        <dt>Name</dt>
        <dd>{parsed.name || 'Not shared'}</dd>
        <dt>Phone</dt>
        <dd>{parsed.phone || 'Not shared'}</dd>
        <dt>Language</dt>
        <dd>{parsed.language}</dd>
      </dl>
    );
  }
  if (index === 2) {
    return (
      <div className="sheet-scroll">
        <table className="sheet">
          <caption className="sr-only">Google Sheet with the newest enquiry at the top</caption>
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Name</th>
              <th scope="col">Wants</th>
              <th scope="col">Urgency</th>
              <th scope="col">Message</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i === 0 ? 'sheet-new' : undefined}>
                <td>{row.time}</td>
                <td>{row.name}</td>
                <td>{row.intent}</td>
                <td>{row.urgency}</td>
                <td>{truncate(row.message, 48)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <p className="reply">{reply}</p>;
}

export default function AISimulator() {
  const [draft, setDraft] = useState(PRESETS[0].text);
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState(-1); // -1 = waiting, 0 to 3 = that stage is running, 4 = all done
  const [parsed, setParsed] = useState(null);
  const [reply, setReply] = useState('');
  const [received, setReceived] = useState('');
  const [rows, setRows] = useState([]);
  const chatRef = useRef(null);

  const busy = phase >= 0 && phase < 4;

  // Each stage runs for a moment, then the next one starts.
  useEffect(() => {
    if (phase < 0 || phase > 3) return undefined;
    const timer = setTimeout(() => setPhase((p) => p + 1), STAGES[phase].ms);
    return () => clearTimeout(timer);
  }, [phase]);

  // Things that happen as the stages move on.
  useEffect(() => {
    if (phase === 2 && parsed) {
      const row = { id: ++nextId, time: received, name: parsed.name || 'Not shared', intent: parsed.intent, urgency: parsed.urgency, message: parsed.text };
      setRows((current) => [row, ...current].slice(0, 4));
    }
    if (phase === 4 && reply) {
      const message = { id: ++nextId, from: 'in', text: reply, time: clock() };
      setMessages((current) => [...current, message]);
    }
    // parsed, reply and received are always set before the phase starts, so only "phase" matters here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Keep the chat in view: show the top of a new reply so it can be read from the start.
  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;
    const bubbles = chat.querySelectorAll('.bubble');
    const last = bubbles[bubbles.length - 1];
    if (last && last.classList.contains('bubble-in') && !last.classList.contains('typing')) {
      chat.scrollTop += last.getBoundingClientRect().top - chat.getBoundingClientRect().top - 8;
    } else {
      chat.scrollTop = chat.scrollHeight;
    }
  }, [messages, phase]);

  const send = () => {
    const text = draft.trim();
    if (!text || busy) return;
    const result = parseEnquiry(text);
    const message = { id: ++nextId, from: 'out', text, time: clock() };
    setParsed(result);
    setReply(buildReply(result));
    setReceived(clock());
    setMessages((current) => [...current, message]);
    setDraft('');
    setPhase(0);
  };

  const reset = () => {
    setPhase(-1);
    setMessages([]);
    setRows([]);
    setParsed(null);
    setReply('');
    setDraft(PRESETS[0].text);
  };

  const liveText = busy ? `Step ${phase + 1} of 4: ${STAGES[phase].title}` : phase === 4 ? 'All four steps are done.' : '';

  return (
    <section className="section" id="simulator" aria-labelledby="simulator-title">
      <div className="wrap">
        <SectionHead id="simulator-title" title="Watch an automation happen, step by step">
          Pick a message a customer might send, press send, and see what happens behind the scenes. This is a simulation, so nothing is really sent to anyone.
        </SectionHead>

        <div className="sim">
          <div className="phone" role="group" aria-label="Customer's WhatsApp chat (simulation)">
            <div className="phone-head">
              <span className="phone-avatar" aria-hidden="true">
                NL
              </span>
              <div>
                <strong>Navio Labs</strong>
                <small>WhatsApp Business (demo)</small>
              </div>
            </div>

            <div className="phone-chat" ref={chatRef}>
              {messages.length === 0 && <p className="phone-empty">No messages yet. Choose an example below and press send.</p>}
              {messages.map((message) => (
                <div key={message.id} className={`bubble bubble-${message.from}`}>
                  {message.text}
                  <span className="bubble-time">{message.time}</span>
                </div>
              ))}
              {phase === 3 && (
                <div className="bubble bubble-in typing" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>

            <div className="phone-compose">
              <div className="presets" role="group" aria-label="Example messages">
                {PRESETS.map((preset) => (
                  <button key={preset.label} type="button" className="preset" disabled={busy} onClick={() => setDraft(preset.text)}>
                    {preset.label}
                  </button>
                ))}
              </div>
              <label className="sr-only" htmlFor="sim-input">
                Customer message
              </label>
              <div className="compose-row">
                <textarea
                  id="sim-input"
                  rows={3}
                  maxLength={400}
                  value={draft}
                  disabled={busy}
                  placeholder="Type a customer message, or choose an example above"
                  onChange={(event) => setDraft(event.target.value)}
                />
                <button type="button" className="send" onClick={send} disabled={busy || !draft.trim()} aria-label="Send enquiry">
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="sr-only" role="status">
              {liveText}
            </p>
            <ol className="pipeline">
              {STAGES.map((stage, i) => {
                const state = phase < 0 ? 'idle' : i < phase ? 'done' : i === phase ? 'active' : 'idle';
                const statusText = state === 'done' ? DONE_TEXT[i] : state === 'active' ? ACTIVE_TEXT[i] : IDLE_TEXT[i];
                return (
                  <li key={stage.title} className={`stage ${state}`}>
                    <span className="stage-no">{state === 'done' ? <CheckIcon /> : i + 1}</span>
                    <div className="stage-body">
                      <h3>{stage.title}</h3>
                      <p className="stage-status">{statusText}</p>
                      {state === 'active' && (
                        <div className="stage-box" aria-hidden="true">
                          <span className="shimmer" />
                          <span className="shimmer" />
                        </div>
                      )}
                      {state === 'done' && parsed && (
                        <div className="stage-box">
                          <StageDetail index={i} parsed={parsed} received={received} rows={rows} reply={reply} />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="sim-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={reset} disabled={busy}>
                Start over
              </button>
            </div>
            <p className="sim-note">In real life these four steps take a few seconds and run on their own, day and night.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
