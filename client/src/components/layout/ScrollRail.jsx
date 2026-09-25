import { useEffect, useRef, useState } from 'react';

// A slim route line on the left edge (wide screens only). It fills as you scroll and
// each station links to a section. It is a shortcut, so the normal menu still has every link.
export default function ScrollRail({ sections }) {
  const fillRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const elements = sections.map((section) => document.getElementById(section.id));
      if (elements.some((element) => !element)) return;

      const y = window.scrollY;
      const viewport = window.innerHeight;
      const tops = elements.map((element) => element.getBoundingClientRect().top + y);
      const reference = y + viewport * 0.35;
      const last = tops.length - 1;

      let index = 0;
      tops.forEach((top, i) => {
        if (top <= reference) index = i;
      });

      let position;
      if (y + viewport >= document.documentElement.scrollHeight - 4) {
        index = last;
        position = last;
      } else if (index < last) {
        const share = (reference - tops[index]) / (tops[index + 1] - tops[index]);
        position = index + Math.min(1, Math.max(0, share));
      } else {
        position = index;
      }

      if (fillRef.current) fillRef.current.style.height = `${(position / last) * 100}%`;
      setActive(index);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('load', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <nav className="rail" aria-label="Page sections">
      <div className="rail-track">
        <div className="rail-fill" ref={fillRef} />
      </div>
      <ul>
        {sections.map((section, i) => (
          <li key={section.id} style={{ '--at': `${(i / (sections.length - 1)) * 100}%` }}>
            <a
              href={`#${section.id}`}
              aria-label={section.label}
              className={i <= active ? 'passed' : undefined}
              aria-current={i === active ? 'location' : undefined}
            >
              <span className="tip">{section.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
