import { PROCESS_STEPS } from '../../data/content.js';

export default function Process() {
  return (
    <section className="section section-soft" id="process" aria-labelledby="process-title">
      <div className="wrap process-grid">
        <div className="process-intro">
          <h2 id="process-title">From first call to a <span className="cursive-highlight" style={{ color: 'var(--coral)' }}>live automation</span></h2>
          <p>You always know what happens next. Four steps, a clear plan, and a person on your side at each one.</p>
          <a className="btn btn-primary" href="#contact">
            Start with a free audit
          </a>
        </div>
        <ol className="steps">
          {PROCESS_STEPS.map((step, index) => (
            <li className="step" key={step.title}>
              <span className="step-no" aria-hidden="true">
                {index + 1}
              </span>
              <div className="step-body">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <p className="gets">
                  <strong>You get:</strong> {step.gets}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
