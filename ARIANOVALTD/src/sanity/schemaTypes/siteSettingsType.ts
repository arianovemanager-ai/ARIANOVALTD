import { CogIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Hero Experiences',
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'home',
      title: 'Home Page',
    },
    {
      name: 'vineyard',
      title: 'Vineyard Page',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Dashboard Title',
      type: 'string',
      initialValue: 'Global Branding & Media',
      readOnly: true,
      hidden: true,
    }),
    // --- HOME PAGE ---
    defineField({
      name: 'homeHeadline',
      title: 'Home Headline',
      type: 'string',
      group: 'home',
      initialValue: 'We design experiences.',
    }),
    defineField({
      name: 'homeSubheadline',
      title: 'Home Subheadline',
      type: 'text',
      group: 'home',
      initialValue: 'Every bottle is chosen to match a feeling, to elevate a moment, to turn a simple gathering into something rare.',
    }),
    defineField({
      name: 'homeVideo',
      title: 'Home Hero Video',
      description: 'Super Premium Recommendation: 1080p resolution, under 10MB, MP4 (H.264) format for maximum speed and compatibility.',
      type: 'file',
      group: 'home',
      options: {
        accept: 'video/mp4',
      },
    }),
    defineField({
      name: 'homePoster',
      title: 'Home Hero Poster',
      description: 'A static image shown while the video is loading. Use a screenshot of the video start.',
      type: 'image',
      group: 'home',
    }),

    // --- VINEYARD PAGE ---
    defineField({
      name: 'vineyardHeadline',
      title: 'Vineyard Headline',
      type: 'string',
      group: 'vineyard',
      initialValue: 'Partner Estates',
    }),
    defineField({
      name: 'vineyardVideo',
      title: 'Vineyard Hero Video',
      description: 'Super Premium Recommendation: 1080p resolution, under 10MB, MP4 (H.264) format for maximum speed and compatibility.',
      type: 'file',
      group: 'vineyard',
      options: {
        accept: 'video/mp4',
      },
    }),
    defineField({
      name: 'vineyardPoster',
      title: 'Vineyard Hero Poster',
      description: 'A static image shown while the video is loading. Use a screenshot of the video start.',
      type: 'image',
      group: 'vineyard',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Global Branding & Media',
        subtitle: 'Hero Headlines and Videos',
      }
    },
  },
})
