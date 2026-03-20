import { defineField, defineType } from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Order History',
  type: 'document',
  fields: [
    defineField({ 
      name: 'stripeSessionId', 
      title: 'Stripe Session ID', 
      type: 'string',
      readOnly: true 
    }),
    defineField({ 
      name: 'customer', 
      title: 'Customer', 
      type: 'reference', 
      to: [{ type: 'customer' }],
      readOnly: true
    }),
    defineField({
      name: 'items',
      title: 'Purchased Items',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'wine', type: 'reference', to: [{ type: 'wine' }] },
            { name: 'quantity', type: 'number' }
          ]
        }
      ]
    }),
    defineField({ name: 'totalPrice', title: 'Total Price (Cents)', type: 'number', readOnly: true }),
    defineField({
      name: 'status',
      title: 'Fulfillment Status',
      type: 'string',
      options: {
        list: ['Processing', 'Shipped', 'Delivered', 'Cancelled']
      },
      initialValue: 'Processing',
      // This is the only field the admin is allowed to change manually
    })
  ],
})
