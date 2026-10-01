import Logo from './Logo.jsx';
import { NAV_LINKS, SITE } from '../../data/content.js';
import { whatsappLink } from '../../utils/format.js';
import '../styles/footer.css';

export default function Footer() {
  const whatsapp = whatsappLink(SITE.whatsapp, SITE.whatsappMessage);

  return (
    <footer className="site-footer">
      <div className="footer-cta wrap">
        <p className="cta-eyebrow">HAVE A PROJECT IN MIND?</p>
        <h2 className="massive-text">LET'S WORK<br/>TOGETHER.</h2>
        <div className="cta-action">
          <a href="#contact" className="btn btn-primary btn-massive">START A PROJECT</a>
        </div>
      </div>

      <div className="footer-main wrap">
        <div className="footer-grid">
          <div className="footer-about">
            <a className="brand" href="#top" aria-label="Navio Labs, back to top">
              <Logo />
              <span>Navio Labs</span>
            </a>
            <p className="footer-tagline">{SITE.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <h3 className="footer-title">Explore</h3>
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
            <h3 className="footer-title">Talk to us</h3>
            <ul className="footer-links">
              <li>
                <a href={`mailto:${SITE.email}`} className="footer-link-hover">{SITE.email}</a>
              </li>
              {whatsapp && (
                <li>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="footer-link-hover">
                    Chat on WhatsApp
                  </a>
                </li>
              )}
              <li>
                <a href="#contact" className="footer-link-hover">Book a free audit</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Navio Labs. Founded by {SITE.founders}.
          </p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
