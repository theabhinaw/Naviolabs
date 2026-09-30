import '../../styles/marquee.css';

const ITEMS = [
  'AI AUTOMATION',
  'WORKFLOW DESIGN',
  'FULL-STACK DEVELOPMENT',
  'CREATIVE SOLUTIONS',
  'DATA ENGINEERING',
  'BUSINESS INTELLIGENCE',
];

export default function Marquee() {
  const content = ITEMS.map((item, i) => (
    <span key={i} className="marquee-item">
      <span className="marquee-sep">✦</span>
      {item}
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-content">{content}</div>
        <div className="marquee-content">{content}</div>
      </div>
    </div>
  );
}
