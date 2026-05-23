import { describe, it, expect, vi } from 'vitest';
import { getWineProductJsonLd } from '@/lib/jsonld';

// Mock urlFor from sanity image-url
vi.mock('@/sanity/lib/image', () => ({
  urlFor: vi.fn().mockReturnValue({
    width: vi.fn().mockReturnValue({
      url: vi.fn().mockReturnValue('https://cdn.sanity.io/images/mock-image.png'),
    }),
  }),
}));

describe('JSON-LD Product Structured Data Mapping', () => {
  it('correctly maps all required schema fields for Product and Offer', () => {
    const mockWine = {
      _id: 'test-wine-id',
      title: 'Amarone della Valpolicella Classico',
      slug: 'amarone-valpolicella-classico',
      sku: 'WINE-AMARONE-001',
      price: 12500, // $125.00
      vintage: 2017,
      winery: 'Tenute di Jato',
      tastingNotes: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Rich dark cherries, cocoa, and full-bodied velvet finish.',
            },
          ],
        },
      ],
      physical_stock: 50,
      committed_stock: 10,
      imageUrl: 'https://cdn.sanity.io/images/fallback.png',
      imageObj: { asset: { _ref: 'image-ref' } },
    };

    const schema = getWineProductJsonLd(mockWine);

    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': 'Amarone della Valpolicella Classico (2017)',
      'description': 'Rich dark cherries, cocoa, and full-bodied velvet finish.',
      'sku': 'WINE-AMARONE-001',
      'brand': {
        '@type': 'Brand',
        'name': 'Tenute di Jato',
      },
      'image': ['https://cdn.sanity.io/images/mock-image.png'],
      'offers': {
        '@type': 'Offer',
        'url': 'https://www.arianova.co.nz/wines/amarone-valpolicella-classico',
        'priceCurrency': 'NZD',
        'price': '125.00',
        'availability': 'https://schema.org/InStock',
        'itemCondition': 'https://schema.org/NewCondition',
      },
    });
  });

  it('correctly defaults missing optional values and handles OutOfStock scenario', () => {
    const mockWine = {
      _id: 'test-wine-id-empty',
      title: 'Simple Table Wine',
      slug: 'simple-table-wine',
      price: 2500, // $25.00
      physical_stock: 5,
      committed_stock: 10, // negative available inventory
      imageUrl: 'https://cdn.sanity.io/images/fallback.png',
    };

    const schema = getWineProductJsonLd(mockWine);

    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': 'Simple Table Wine',
      'description': 'Acquire the rare  Simple Table Wine curated by Arianova. Authentic collection direct from partner cellars.',
      'sku': 'wine-test-wine-id-empty',
      'brand': {
        '@type': 'Brand',
        'name': 'Arianova Estate',
      },
      'image': ['https://cdn.sanity.io/images/fallback.png'],
      'offers': {
        '@type': 'Offer',
        'url': 'https://www.arianova.co.nz/wines/simple-table-wine',
        'priceCurrency': 'NZD',
        'price': '25.00',
        'availability': 'https://schema.org/OutOfStock',
        'itemCondition': 'https://schema.org/NewCondition',
      },
    });
  });
});
