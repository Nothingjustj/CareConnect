import Script from 'next/script';

export default function OrganizationSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CareConnect",
    "url": "https://CareConnecpp",
    "logo": "https:/CareConnecapp/logoCare.png",
    "sameAs": [
      "https://twitter.com/sharma",
      "https://www.linkedin.com/in/jagriti/",
    
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-1234567890",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ludhiana",
      "addressLocality": "Ludhiana",
      "addressRegion": "Punjab",
      "postalCode": "141013",
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