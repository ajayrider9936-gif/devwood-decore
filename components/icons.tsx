/**
 * Professional inline SVG icon set — replaces all emojis across the site.
 * Stroke-based, minimal, consistent 1.8px stroke. No emoji, no childish art.
 */

type P = { className?: string };

const base = (className?: string) =>
  `fill-none stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round ${className || ""}`;

export const IconPhone = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />
  </svg>
);

export const IconPin = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const IconChat = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8.5z" />
  </svg>
);

export const IconWhatsApp = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88zm8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.47-8.4z" />
  </svg>
);

export const IconTruck = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M1 8h13v9H1zM14 11h4l4 4v2h-8z" />
    <circle cx="5.5" cy="18.5" r="1.8" />
    <circle cx="17.5" cy="18.5" r="1.8" />
  </svg>
);

export const IconLeaf = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 9-10 4.5-1.5 7-1 7-1s-.5 2.5-2 7c-2 6-6 9-7 11z" />
    <path d="M4 21c4-6 8-9 12-11" />
  </svg>
);

export const IconRuler = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M21.3 8.7l-6-6a1 1 0 0 0-1.4 0l-11 11a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0l11-11a1 1 0 0 0 0-1.4z" />
    <path d="M7.5 10.5l2 2M10.5 7.5l2 2M13.5 4.5l2 2" />
  </svg>
);

export const IconHand = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M18 11V6.5a1.5 1.5 0 0 0-3 0V11m0-5.5v-2a1.5 1.5 0 0 0-3 0V11m0-6.5a1.5 1.5 0 0 0-3 0V12m-3-4a1.5 1.5 0 0 0-3 0v6c0 4 3 7 7 7h1c3 0 5-1 6.5-3.5l2-3.5a1.6 1.6 0 0 0-2.7-1.6L18 14" />
  </svg>
);

export const IconTree = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M12 22v-7" />
    <path d="M12 15L4 9l3-5 5 3 5-3 3 5-8 6z" />
    <path d="M12 4V2" />
  </svg>
);

export const IconStar = ({ className, filled }: P & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth={filled ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
);

export const IconCheck = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const IconGrid = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
  </svg>
);

export const IconBox = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
    <path d="M3 8l9 5 9-5M12 13v8" />
  </svg>
);

export const IconFolder = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export const IconGear = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.89a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01A1.7 1.7 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01A1.7 1.7 0 0 0 20.91 10H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" />
  </svg>
);

export const IconLogout = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const IconGlobe = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const IconImage = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

export const IconLock = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={base(className)} aria-hidden>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
