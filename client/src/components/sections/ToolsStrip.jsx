import { TOOLS } from '../../data/content.js';

export default function ToolsStrip() {
  return (
    <section className="tools" aria-label="Tools we build with">
      <div className="wrap">
        <p>We build with tools your team already knows:</p>
        <ul>
          {TOOLS.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
