import { HERO_STATS, SITE } from '../../data/content.js';
import WorkflowVisualizer from './WorkflowVisualizer.jsx';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero-grid">
          <h1 id="hero-title">
            Put <span className="cursive-highlight" style={{ fontSize: '1.2em' }}>AI</span> to work inside the tools you already use.
          </h1>
          <div className="hero-side">
            <p className="lead">
              {SITE.tagline} We take repetitive work off your team, so you save time and money.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#contact">
                Book a free workflow audit
              </a>
              <a className="btn btn-ghost" href="#route">
                Watch a workflow run
              </a>
            </div>
            <p className="fine">The audit is free and there is no commitment.</p>
          </div>
        </div>

        <ul className="stats" aria-label="Navio Labs at a glance">
          {HERO_STATS.map((stat) => (
            <li key={stat.label}>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>

        <WorkflowVisualizer />
      </div>
    </section>
  );
}
