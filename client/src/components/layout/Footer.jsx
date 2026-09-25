import Logo from './Logo.jsx';
import { NAV_LINKS, SITE } from '../../data/content.js';
import { whatsappLink } from '../../utils/format.js';

export default function Footer() {
  const whatsapp = whatsappLink(SITE.whatsapp, SITE.whatsappMessage);

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-about">
            <a className="brand" href="#top" aria-label="Navio Labs, back to top">
              <Logo />
              <span>Navio Labs</span>
            </a>
            <p>{SITE.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="footer-title">Explore</h2>
            <ul className="footer-links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
              <li>
                <a href="#process">How it works</a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="footer-title">Talk to us</h2>
            <ul className="footer-links">
              <li>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              {whatsapp && (
                <li>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </li>
              )}
              <li>
                <a href="#contact">Book a free audit</a>
              </li>
            </ul>
          </div>
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} Navio Labs. Founded by {SITE.founders}.
        </p>
      </div>
    </footer>
  );
}
