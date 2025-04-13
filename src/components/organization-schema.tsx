import Script from 'next/script';

export default function OrganizationSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RogiSetu",
    "url": "https://rogisetu.vercel.app",
    "logo": "https://rogisetu.vercel.app/favicon.png",
    "sameAs": [
      "https://twitter.com/sharmaadityax",
      "https://www.linkedin.com/in/aditya-r-sharma/",
      "https://www.facebook.com/adityasharma4857"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-7304066855",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mira Road",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "401107",
      "addressCountry": "IN"
    }
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 