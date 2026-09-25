import SectionHead from '../ui/SectionHead.jsx';
import { SERVICES } from '../../data/content.js';

export default function Services() {
  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHead id="services-title" title={<>What we <span className="cursive-highlight" style={{ color: 'var(--teal)' }}>build</span></>}>
          Four services under one roof. Start with one and add the others as you grow. Every project begins with a free audit of how your team works today.
        </SectionHead>

        <ul className="lines">
          {SERVICES.map((service) => (
            <li className="line-row" key={service.id} style={{ '--lane': `var(--${service.lane})` }}>
              <div className="line-id">
                <span className="line-bar" aria-hidden="true" />
                <h3>{service.title}</h3>
              </div>
              <div className="line-copy">
                <p>{service.text}</p>
                <ul className="chips" aria-label={`Tools for ${service.title}`}>
                  {service.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>
              <ul className="outcomes">
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
