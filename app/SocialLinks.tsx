import { contactDetails } from './contact-details';

export default function SocialLinks({ compact = false }: { compact?: boolean }) {
  return <div className={'social-links' + (compact ? ' compact' : '')}>
    <a href={contactDetails.facebookHref} target="_blank" rel="noopener noreferrer" aria-label="XIECHU on Facebook (opens in a new tab)">
      <span className="social-icon facebook-icon"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.6 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5H17V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.5v2.1H7.2v3.2h2.9V21h3.5Z" /></svg></span>
      <span className="social-link-copy"><strong>Facebook</strong>{!compact && <small>Visit our Facebook page</small>}</span>{!compact && <span className="social-arrow" aria-hidden="true">↗</span>}
    </a>
    <a href={contactDetails.instagramHref} target="_blank" rel="noopener noreferrer" aria-label="XIECHU on Instagram (opens in a new tab)">
      <span className="social-icon instagram-icon"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></span>
      <span className="social-link-copy"><strong>Instagram</strong>{!compact && <small>@harryxiechu</small>}</span>{!compact && <span className="social-arrow" aria-hidden="true">↗</span>}
    </a>
  </div>;
}
