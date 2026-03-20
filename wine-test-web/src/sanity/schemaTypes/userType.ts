import { defineField, defineType } from 'sanity'

export const userType = defineType({
  name: 'customer',
  title: 'Customer Profile',
  type: 'document',
  fields: [
    defineField({ 
      name: 'clerkId', 
      title: 'Clerk ID', 
      type: 'string', 
      readOnly: true, // Only the webhook should write this
      description: 'The unique identifier synced from Clerk Authentication.'
    }),
    defineField({ name: 'fullName', title: 'Full Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email Address', type: 'string' }),
    defineField({
      name: 'palatePreferences',
      title: 'Palate Preferences',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Bold Reds', value: 'bold-reds' },
          { title: 'Light Reds', value: 'light-reds' },
          { title: 'Crisp Whites', value: 'crisp-whites' },
          { title: 'Rich Whites', value: 'rich-whites' },
          { title: 'Sparkling', value: 'sparkling' }
        ]
      }
    }),
    defineField({ name: 'newsletterOptIn', title: 'Newsletter Opt-In', type: 'boolean', initialValue: false }),
  ],
})
