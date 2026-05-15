import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  type?: string;
  url?: string;
  image?: string;
}

export default function SEO({
  title = "AI Metaworld | Premium AI & Digital Agency",
  description = "We design cinematic digital experiences that combine strategy, AI, and creativity to help brands grow faster. Specializing in Web Design, Branding, AI Fashion, and Power BI.",
  keywords = "AI Agency, Web Development, Premium Design, UI/UX, AI Fashion, Power BI Dashboards, Branding, Print on Demand",
  type = "website",
  url = "https://aimetaworld.com/",
  image = "https://aimetaworld.com/favicon.webp"
}: SEOProps) {
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
