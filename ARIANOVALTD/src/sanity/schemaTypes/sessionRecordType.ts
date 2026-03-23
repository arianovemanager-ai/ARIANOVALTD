import { defineType, defineField } from 'sanity'

export const sessionRecordType = defineType({
  name: 'sessionRecord',
  title: 'Session Record (Internal)',
  type: 'document',
  fields: [
    defineField({
      name: 'sessionId',
      title: 'Stripe Session ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'Expired', value: 'expired' },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: 'processedAt',
      title: 'Processed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'sessionId',
      subtitle: 'status',
    },
  },
})
