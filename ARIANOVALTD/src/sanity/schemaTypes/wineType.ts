import { defineField, defineType } from 'sanity'

export const wineType = defineType({
  name: 'wine',
  title: 'Wine Catalog & Inventory',
  type: 'document',
  fields: [
    // Marketing & Display
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'URL Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'sku', title: 'SKU', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'price', title: 'Price (in Cents)', type: 'number', description: 'Store in cents for Stripe (e.g., $45.00 = 4500)' }),
    defineField({ name: 'tastingNotes', title: 'Tasting Notes', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }], // Hotspot allows admins to crop easily
    }),
    
    // Logistics & State Management
    defineField({ 
      name: 'physical_stock', 
      title: 'Physical Stock', 
      type: 'number', 
      initialValue: 0,
      description: 'The actual number of bottles sitting in the warehouse.'
    }),
    defineField({ 
      name: 'committed_stock', 
      title: 'Committed Stock', 
      type: 'number', 
      initialValue: 0,
      description: 'Bottles currently locked in active Stripe checkouts.'
    }),
    defineField({ 
      name: 'low_stock_alert', 
      title: 'Low Stock Alert Threshold', 
      type: 'number', 
      initialValue: 12 
    }),
  ],
  preview: {
    select: {
      title: 'title',
      physicalStock: 'physical_stock',
      committedStock: 'committed_stock',
      media: 'images.0'
    },
    prepare(selection) {
      const {title, physicalStock = 0, committedStock = 0, media} = selection
      
      const available = physicalStock - committedStock
      
      let subtitle = ''
      if (physicalStock <= 0 || available <= 0) {
        subtitle = '🚨 OUT OF STOCK'
      } else {
        subtitle = `Available to Sell: ${available} (Physical: ${physicalStock})`
      }

      return {
        title: title,
        subtitle: subtitle,
        media: media
      }
    }
  }
})
