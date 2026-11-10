export default function FloatingContact() {
  return (
    <nav className="floating-contact" aria-label="Quick contact">
      <a
        className="floating-contact-link whatsapp"
        href="https://wa.me/8619930715424"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Jieting on WhatsApp (opens in a new tab)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.48 0 .13 5.35.13 11.92c0 2.1.55 4.15 1.6 5.96L.03 24l6.26-1.64a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.18-3.45-8.43ZM12.05 21.8a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.26c0-5.46 4.44-9.9 9.91-9.9a9.84 9.84 0 0 1 7 2.9 9.84 9.84 0 0 1 2.89 7c0 5.46-4.44 9.88-9.93 9.88Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.35Z" />
        </svg>
        <span className="floating-contact-label">WhatsApp <span>Let’s talk packaging ↗</span></span>
      </a>
      <a
        className="floating-contact-link email"
        href="mailto:angel@jietingpackage.com"
        aria-label="Email Jieting at angel@jietingpackage.com"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
        <span className="floating-contact-label">Email us <span>angel@jietingpackage.com ↗</span></span>
      </a>
    </nav>
  );
}
