import { Helmet } from 'react-helmet-async';
import { useSettings } from '../contexts/SettingsContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  type?: string;
  url?: string;
  image?: string;
}

export default function SEO(props: SEOProps) {
  const { settings } = useSettings();
  const { brand_settings } = settings;

  const title = props.title || `${brand_settings.brandName} | ${brand_settings.tagline}`;
  const description = props.description || "We design cinematic digital experiences that combine strategy, AI, and creativity to help brands grow faster. Specializing in Web Design, Branding, AI Fashion, and Power BI.";
  const keywords = props.keywords || "AI Agency, Web Development, Premium Design, UI/UX, AI Fashion, Power BI Dashboards, Branding, Print on Demand";
  const type = props.type || "website";
  const url = props.url || "https://aimetaworld.com/";
  const image = props.image || brand_settings.logoUrl || "https://aimetaworld.com/favicon.webp";

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}
