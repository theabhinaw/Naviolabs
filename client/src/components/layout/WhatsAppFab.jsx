import { SITE } from '../../data/content.js';
import { whatsappLink } from '../../utils/format.js';
import { WhatsAppIcon } from '../ui/Icons.jsx';

// Floating "Chat on WhatsApp" button. It only shows when VITE_WHATSAPP_NUMBER is set.
export default function WhatsAppFab() {
  const link = whatsappLink(SITE.whatsapp, SITE.whatsappMessage);
  if (!link) return null;
  return (
    <a className="wa-fab" href={link} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
      <WhatsAppIcon />
      <span className="wa-label">Chat on WhatsApp</span>
    </a>
  );
}
