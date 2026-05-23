import type { Metadata } from 'next';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  openGraphType?: 'website' | 'article' | 'book';
  image?: string;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arianova.co.nz';

/**
 * Standard SEO helper to build metadata objects for Next.js App Router.
 * Enforces Section 8 constraints of ARCHITECTURE.md (60 chars max title, 160 chars max description).
 */
export function getSeoMetadata({
  title,
  description,
  path,
  openGraphType = 'website',
  image,
}: SeoProps): Metadata {
  const cleanTitle = title.length > 60 ? `${title.slice(0, 57)}...` : title;
  const cleanDescription = description.length > 160 ? `${description.slice(0, 157)}...` : description;
  
  // Normalize path format
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${siteUrl}${normalizedPath}`;

  const meta: Metadata = {
    title: cleanTitle,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url: canonicalUrl,
      type: openGraphType,
      siteName: 'Arianova',
      locale: 'en_US',
    },
  };

  if (image && meta.openGraph) {
    meta.openGraph.images = [{ url: image }];
    meta.twitter = {
      card: 'summary_large_image',
      images: [image],
    };
  }

  return meta;
}
