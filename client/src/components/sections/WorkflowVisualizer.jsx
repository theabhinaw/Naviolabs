import { useEffect, useState } from 'react';
import { WORKFLOWS } from '../../data/workflows.js';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion.js';
import useInView from '../../hooks/useInView.js';
import { PauseIcon, PlayIcon } from '../ui/Icons.jsx';

const KEYS = Object.keys(WORKFLOWS);

// An animated "route map": pick a workflow and a signal travels station by station.
export default function WorkflowVisualizer() {
  const reduced = usePrefersReducedMotion();
  const [key, setKey] = useState(KEYS[0]);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false); // paused by the visitor
  const [hovering, setHovering] = useState(false); // mouse is over the route: pause so it can be read
  const [rootRef, inView] = useInView({ threshold: 0.15 });

  const steps = WORKFLOWS[key].steps;
  const last = steps.length - 1;

  // People who prefer less motion see the finished route and can click any station.
  useEffect(() => {
    if (reduced) setStep(last);
  }, [reduced, key, last]);

  // Autoplay: move to the next station after a short wait, then start again.
  useEffect(() => {
    if (reduced || paused || hovering || !inView) return undefined;
    const wait = step === 0 ? 1300 : step === last ? 3200 : 2300;
    const timer = setTimeout(() => setStep((s) => (s >= last ? 0 : s + 1)), wait);
    return () => clearTimeout(timer);
  }, [step, last, reduced, paused, hovering, inView]);

  const chooseWorkflow = (next) => {
    setKey(next);
    setStep(reduced ? WORKFLOWS[next].steps.length - 1 : 0);
    setPaused(false);
  };

  const jumpTo = (index) => {
    setPaused(true);
    setStep(index);
  };

  const togglePlay = () => {
    if (paused && step >= last) setStep(0);
    setPaused((value) => !value);
  };

  return (
    <div
      className="route"
      id="route"
      data-lane={key}
      ref={rootRef}
      onPointerEnter={(event) => event.pointerType === 'mouse' && setHovering(true)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && setHovering(false)}
    >
      <div className="route-bar">
        <p className="route-hint" id="route-hint">
          Pick a workflow and watch it run:
        </p>
        <div className="lanes" role="group" aria-labelledby="route-hint">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              className="lane"
              aria-pressed={k === key}
              style={{ '--c': `var(--${WORKFLOWS[k].color})` }}
              onClick={() => chooseWorkflow(k)}
            >
              <span className="swatch" />
              {WORKFLOWS[k].label}
            </button>
          ))}
        </div>
        {!reduced && (
          <button
            type="button"
            className="play"
            data-paused={paused}
            aria-label={paused ? 'Play the animation' : 'Pause the animation'}
            onClick={togglePlay}
          >
            <PauseIcon />
            <PlayIcon />
            <span>{paused ? 'Play' : 'Pause'}</span>
          </button>
        )}
      </div>

      {/* key={key} restarts the list when another workflow is picked */}
      <ol className="stops" key={key}>
        {steps.map((s, i) => {
          const state = [i <= step ? 'reached' : '', i < step ? 'done' : '', i === step ? 'active' : ''].join(' ');
          return (
            <li key={s.title} className={`stop ${state}`}>
              <div className="mark">
                <span className="seg" aria-hidden="true" />
                <button
                  type="button"
                  className="station"
                  aria-label={`Step ${i + 1}: ${s.title}`}
                  aria-current={i === step ? 'step' : undefined}
                  onClick={() => jumpTo(i)}
                />
              </div>
              <div className="stop-body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul className="apps">
                  {s.apps.map((app) => (
                    <li key={app}>{app}</li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
