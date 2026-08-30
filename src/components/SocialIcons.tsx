import React from 'react';
import { Globe, Mail, Link as LinkIcon } from 'lucide-react';

// Common SVG props
const iconProps = {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.1-.34 6.33-1.55 6.33-6.99 0-1.5-.5-2.77-1.33-3.7.13-.31.5-1.75-.13-3.6 0 0-1-.31-3.3 1.2a11.5 11.5 0 0 0-6 0C7.2 1.69 6.2 2 6.2 2c-.63 1.85-.26 3.29-.13 3.6-1.83 2.1-1.33 3.7-1.33 3.7-5.44.44-6.33 1.65-6.33 6.99 0 1.5.5 2.77 1.33 3.7-.63 1.85.1 3.02 1 3.02v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

export const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

export const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
);

export const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

export const WhatsApp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
    <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
  </svg>
);

export const TikTok = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M21 7.9a6 6 0 0 1 -6 -6v15a6 6 0 1 1 -6 -6v2a4 4 0 1 0 4 4v-11a8.1 8.1 0 0 0 5.07 2.15" />
  </svg>
);

export const Pinterest = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="8" y1="20" x2="12" y2="11" />
    <path d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export const Discord = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <circle cx="9" cy="12" r="1" fill="currentColor"/>
    <circle cx="15" cy="12" r="1" fill="currentColor"/>
    <path d="M7.5 7.5c3.5 -1 5.5 -1 9 0" />
    <path d="M7 16.5c3.5 1 6.5 1 10 0" />
    <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5" />
    <path d="M8.5 17c0 1 -1.5 3 -2 3c-1.5 0 -2.833 -1.667 -3.5 -3c-.667 -1.667 -.5 -5.833 1.5 -11.5c1.457 -1.015 3 -1.34 4.5 -1.5l1 2.5" />
  </svg>
);

export const Reddit = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14z" />
    <path d="M12 8l1 -5l6 1" />
    <circle cx="19" cy="4" r="1" />
    <circle cx="9" cy="13" r=".5" fill="currentColor" />
    <circle cx="15" cy="13" r=".5" fill="currentColor" />
    <path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5" />
  </svg>
);

export const Telegram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
  </svg>
);

export const Snapchat = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M16 11.026c0 -.417 -1.22 -.836 -1.98 -.916c-.73 -1.218 -.648 -2.483 -.472 -3.376c.148 -.748 .703 -2.25 1.13 -3.275c.145 -.348 .48 -.611 .865 -.634c.052 0 .105 0 .157 .002v0h-.01c1.378 -.054 2.531 1.054 2.658 2.378c.071 .763 .232 1.488 .472 2.164c.245 .69 .624 1.343 1.127 1.933c.365 .428 .436 .944 .153 1.319c-.27 .356 -1.026 .526 -1.948 .429c-.895 -.09 -1.637 .223 -1.954 .605c-.324 .392 -.285 1.14 -.256 1.405l.078 .825v0l.135 1.303v.01l0 .01a2.127 2.127 0 0 1 -1.411 2.213a8.883 8.883 0 0 1 -2.74 .44h0v0a8.883 8.883 0 0 1 -2.74 -.44a2.127 2.127 0 0 1 -1.411 -2.213v-.01l.135 -1.303l.078 -.825c.03 -.265 .069 -1.013 -.256 -1.405c-.317 -.382 -1.06 -.695 -1.954 -.605c-.922 .097 -1.678 -.073 -1.948 -.429c-.283 -.375 -.212 -.891 .153 -1.319c.503 -.59 .882 -1.243 1.127 -1.933c.24 -.676 .401 -1.401 .472 -2.164c.127 -1.324 1.28 -2.432 2.658 -2.378h-.01v0c.052 -.002 .105 -.002 .157 -.002c.385 .023 .72 .286 .865 .634c.427 1.025 .982 2.527 1.13 3.275c.176 .893 .258 2.158 -.472 3.376c-.76 .08 -1.98 .5 -1.98 .916z" />
    <path d="M12 18.25v2.75" />
    <path d="M10 20l4 -1" />
  </svg>
);

export const Behance = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 18v-12h4.5a3 3 0 0 1 0 6a3 3 0 0 1 0 6h-4.5" />
    <line x1="3" y1="12" x2="7.5" y2="12" />
    <path d="M14 13h7a3.5 3.5 0 0 0 -7 0v2a3.5 3.5 0 0 0 6.64 1" />
    <line x1="16" y1="6" x2="19" y2="6" />
  </svg>
);

export const Dribbble = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 3.6c5 6 7 10.5 7.5 16.2" />
    <path d="M6.4 19c3.5 -3.5 6 -6.5 14.5 -6.4" />
    <path d="M3.1 10.75c5 0 9.814 -.38 15.314 -5" />
  </svg>
);

// Fallbacks for standard Icons from lucide
export const GlobeIcon = Globe;
export const MailIcon = Mail;
export const GenericLinkIcon = LinkIcon;

export const Threads = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M19 7.5c-1.333 -3 -3.667 -4.5 -7 -4.5c-5 0 -8 2.5 -8 9s3.5 9 8 9s7 -3 7 -5s-1 -5 -7 -5c-2.5 0 -3 1.25 -3 2.5c0 1.5 1 2.5 2.5 2.5c2.5 0 3.5 -1.5 3.5 -5s-2 -4 -3 -4s-1.833 .333 -2.5 1" />
  </svg>
);

export const Medium = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 9h1l3 3l3 -3h1" />
    <line x1="8" y1="15" x2="10" y2="15" />
    <line x1="14" y1="15" x2="16" y2="15" />
    <line x1="9" y1="9" x2="9" y2="15" />
    <line x1="15" y1="9" x2="15" y2="15" />
  </svg>
);

export function getSocialIcon(platformId: string) {
  const id = (platformId || '').toLowerCase().trim();
  switch (id) {
    case 'instagram': return Instagram;
    case 'linkedin': return Linkedin;
    case 'github': return Github;
    case 'facebook': return Facebook;
    case 'twitter':
    case 'x': 
    case 'x / twitter': return XIcon;
    case 'youtube': return Youtube;
    case 'whatsapp': return WhatsApp;
    case 'tiktok': return TikTok;
    case 'threads': return Threads;
    case 'pinterest': return Pinterest;
    case 'telegram': return Telegram;
    case 'discord': return Discord;
    case 'reddit': return Reddit;
    case 'snapchat': return Snapchat;
    case 'behance': return Behance;
    case 'dribbble': return Dribbble;
    case 'medium': return Medium;
    case 'website': return GlobeIcon;
    case 'email': return MailIcon;
    default: return GenericLinkIcon;
  }
}
