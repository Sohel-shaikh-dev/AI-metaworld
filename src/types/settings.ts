export interface BrandSettings {
  brandName: string;
  tagline: string;
  logoUrl: string;
}

export interface HeroSettings {
  eyebrow: string;
  headlineStatic: string;
  headlineHighlight: string;
  typewriterWords: string[];
  description: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  trustMicrocopy: string;
  bannerPrefix: string;
  bannerHighlight: string;
  bannerSuffix: string;
}

export interface AboutSettings {
  eyebrow: string;
  headingStatic: string;
  headingHighlight: string;
  description1: string;
  description2: string;
  quoteText: string;
  starTextPrefix: string;
  starTextHighlight: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  iconName: string;
  order: number;
  active: boolean;
}

export interface ContactSettings {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapUrl?: string;
  workingHours: string;
  responseTime: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  order: number;
  active: boolean;
}

export interface FooterSettings {
  description: string;
  ctaHeading: string;
  ctaHighlight: string;
  ctaDescription: string;
  ctaImageUrl: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
  copyrightText: string;
  agencyRoleText: string;
}

export interface SiteSettings {
  brand_settings: BrandSettings;
  hero_settings: HeroSettings;
  about_settings: AboutSettings;
  stats_settings: StatItem[];
  contact_settings: ContactSettings;
  social_settings: SocialLink[];
  footer_settings: FooterSettings;
}

export const defaultSiteSettings: SiteSettings = {
  brand_settings: {
    brandName: "AI METAWORLD",
    tagline: "AI Powered Creative Agency",
    logoUrl: "/Assets/logo.webp",
  },
  hero_settings: {
    eyebrow: "Available for New Projects",
    headlineStatic: "We Build",
    headlineHighlight: "AI-Powered\\nCreative Systems.", // Default first typewriter word
    typewriterWords: [
      "AI-Powered\\nCreative Systems.",
      "Premium\\nDigital Experiences.",
      "Luxury\\nWebsite Design.",
      "Modern\\nBrand Identity."
    ],
    description: "Websites, branding, AI videos, and digital systems designed for modern businesses.",
    primaryCtaText: "Start a Project",
    primaryCtaUrl: "#contact",
    secondaryCtaText: "Our Process",
    secondaryCtaUrl: "#process",
    trustMicrocopy: "Usually replies within 1 hour",
    bannerPrefix: "We create",
    bannerHighlight: "AI-Powered Websites.",
    bannerSuffix: "Smart solutions. Scalable systems. \\nPowered by creativity and AI."
  },
  about_settings: {
    eyebrow: "ABOUT AI METAWORLD",
    headingStatic: "We Don't Just\\nBuild Websites.",
    headingHighlight: "We Build Digital\\nPresence.",
    description1: "AI Metaworld is a modern creative studio helping businesses grow through premium websites, AI-powered content, branding, and smart digital experiences.",
    description2: "We combine creativity, technology, and strategy to build solutions that not only look premium but also deliver real results.",
    quoteText: "Our mission is simple – help businesses build a strong digital identity and achieve long-term growth with smart, scalable and creative solutions.",
    starTextPrefix: "We don't follow trends,\\nwe create impact.\\n",
    starTextHighlight: "That's AI Metaworld.",
  },
  stats_settings: [
    { id: '1', value: '15+', label: 'Projects\\nCompleted', iconName: 'BriefcaseBusiness', order: 1, active: true },
    { id: '2', value: '8+', label: 'Brands\\nEmpowered', iconName: 'Users', order: 2, active: true },
    { id: '3', value: '2+', label: 'Years of\\nExperience', iconName: 'Clock', order: 3, active: true },
    { id: '4', value: '24h', label: 'Avg. Response\\nTime', iconName: 'Smartphone', order: 4, active: true }
  ],
  contact_settings: {
    email: "aimetaworldd@gmail.com",
    phone: "+91 7718938615",
    whatsapp: "917718938615",
    address: "Nalasopara East, Maharashtra",
      mapUrl: "",
    workingHours: "Mon - Sat: 10AM - 8PM",
    responseTime: "within 1 hour"
  },
  social_settings: [
    { id: '1', platform: 'Instagram', url: 'https://instagram.com/ai_metaworld', iconName: 'Instagram', order: 1, active: true },
    { id: '2', platform: 'LinkedIn', url: 'https://www.linkedin.com/in/sohel-shaikhh/', iconName: 'Linkedin', order: 2, active: true },
    { id: '3', platform: 'GitHub', url: 'https://github.com/Sohel-shaikh-dev', iconName: 'Github', order: 3, active: true },
    { id: '4', platform: 'Facebook', url: 'https://www.facebook.com/share/1asBpmQEbw/', iconName: 'Facebook', order: 4, active: true },
    { id: '5', platform: 'YouTube', url: 'https://www.youtube.com/@Aimetaworld', iconName: 'Youtube', order: 5, active: true }
  ],
  footer_settings: {
    description: "We blend strategy, AI and cinematic design to create premium digital experiences that drive real results.",
    ctaHeading: "Let's Build Something",
    ctaHighlight: "Exceptional.",
    ctaDescription: "We create AI-powered digital experiences that help brands grow faster and stand out.",
    ctaImageUrl: "",
    ctaButtonText: "Start Your Project",
    ctaButtonUrl: "#contact",
    copyrightText: "AI Metaworld. All rights reserved.",
    agencyRoleText: "AI POWERED CREATIVE AGENCY"
  }
};
