import { useState } from 'react';
import SectionHead from '../ui/SectionHead.jsx';
import { FAQS } from '../../data/content.js';

export default function FAQ() {
  const [open, setOpen] = useState(0); // index of the open answer, -1 = all closed

  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="wrap">
        <SectionHead id="faq-title" title={<>Questions we hear <span className="cursive-highlight" style={{ color: 'var(--amber)' }}>often</span></>}>
          Not here? Ask us in the form below and we will answer in plain language.
        </SectionHead>

        <div className="faq-list">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className="faq-item" key={item.q}>
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {item.q}
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!isOpen}>
                  <p className="faq-a">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
