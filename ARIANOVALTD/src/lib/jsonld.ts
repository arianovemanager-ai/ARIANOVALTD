import { urlFor } from "@/sanity/lib/image";

function portableTextToPlainText(blocks: any[]): string {
  if (!blocks) return '';
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return block.children.map((child: any) => child.text).join('');
    })
    .join('\n');
}

export function getWineProductJsonLd(wine: any) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arianova.co.nz';
  const displayImageUrl = wine.imageObj
    ? urlFor(wine.imageObj).width(1200).url()
    : wine.imageUrl;

  const available = (wine.physical_stock || 0) - (wine.committed_stock || 0);
  const availability = available > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  
  const plainTextDescription = wine.tastingNotes && wine.tastingNotes.length > 0
    ? portableTextToPlainText(wine.tastingNotes)
    : `Acquire the rare ${wine.vintage ? `Vintage ${wine.vintage}` : ""} ${wine.title} curated by Arianova. Authentic collection direct from partner cellars.`;

  const productName = wine.vintage ? `${wine.title} (${wine.vintage})` : wine.title;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': productName,
    'description': plainTextDescription,
    'sku': wine.sku || `wine-${wine._id}`,
    'brand': {
      '@type': 'Brand',
      'name': wine.winery || 'Arianova Estate',
    },
    'offers': {
      '@type': 'Offer',
      'url': `${siteUrl}/wines/${wine.slug}`,
      'priceCurrency': 'NZD',
      'price': (wine.price / 100).toFixed(2),
      'availability': availability,
      'itemCondition': 'https://schema.org/NewCondition',
    },
  };

  if (displayImageUrl) {
    schema.image = [displayImageUrl];
  }

  return schema;
}
