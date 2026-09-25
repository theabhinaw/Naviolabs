// The Navio Labs mark: a route line with two stations. Colours come from styles/header.css.
export default function Logo({ className = 'logo' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path className="logo-line" d="M7 25V7l18 18V7" />
      <circle className="logo-st logo-st-a" cx="7" cy="25" r="3.6" />
      <circle className="logo-st logo-st-b" cx="25" cy="7" r="3.6" />
    </svg>
  );
}
