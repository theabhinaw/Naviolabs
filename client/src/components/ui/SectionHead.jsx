export default function SectionHead({ id, title, children }) {
  return (
    <div className="section-head">
      <h2 id={id}>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
