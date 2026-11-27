import {defineArrayMember, defineField, defineType} from 'sanity'

import {hrefFormat} from './rules'

const image = (name: string, title: string) =>
  defineField({name, title, type: 'image', options: {hotspot: true}})

const hero = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'titleLines',
      title: 'Title lines',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'aside', title: 'Side text', type: 'text', rows: 2}),
    defineField({name: 'button', title: 'Button', type: 'link'}),
    image('image', 'Background image'),
  ],
  preview: {
    select: {lines: 'titleLines', media: 'image'},
    prepare: ({lines, media}) => ({title: lines?.[0] || 'Hero', subtitle: 'Hero', media}),
  },
})

const pageHero = defineType({
  name: 'pageHeroSection',
  title: 'Page hero',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'accent',
      title: 'Heading, italic part',
      type: 'string',
      description: 'Optional. Continues the heading in italics.',
    }),
    defineField({name: 'lede', title: 'Text', type: 'text', rows: 3}),
    defineField({name: 'button', title: 'Button', type: 'link'}),
    image('image', 'Image'),
    defineField({
      name: 'wide',
      title: 'Wide layout',
      type: 'boolean',
      description: 'Text above a wide image instead of text beside a tall one.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare: ({title, media}) => ({title: title || 'Page hero', subtitle: 'Page hero', media}),
  },
})

const split = defineType({
  name: 'splitSection',
  title: 'Text and image',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'accent',
      title: 'Heading, italic part',
      type: 'string',
      description: 'Optional. Continues the heading in italics.',
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'text',
      rows: 6,
      description: 'Leave an empty line between paragraphs.',
    }),
    defineField({name: 'button', title: 'Button', type: 'link'}),
    defineField({
      name: 'media',
      title: 'Beside the text',
      type: 'string',
      options: {
        list: [
          {title: 'An image', value: 'image'},
          {title: 'Product cans', value: 'cans'},
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.media === 'cans',
    }),
    defineField({
      name: 'caption',
      title: 'Image caption',
      type: 'string',
      hidden: ({parent}) => parent?.media === 'cans',
    }),
    defineField({
      name: 'products',
      title: 'Cans to show',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      hidden: ({parent}) => parent?.media !== 'cans',
    }),
    defineField({name: 'flip', title: 'Image on the left', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'eyebrow', media: 'image'},
    prepare: ({title, subtitle, media}) => ({
      title: title || 'Text and image',
      subtitle: subtitle ? `Text and image · ${subtitle}` : 'Text and image',
      media,
    }),
  },
})

const marquee = defineType({
  name: 'marqueeSection',
  title: 'Logo marquee',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'marqueeItem',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string'}),
            image('logo', 'Logo (optional, the name is shown without one)'),
          ],
          preview: {select: {title: 'name', media: 'logo'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'label'},
    prepare: ({title}) => ({title: title || 'Marquee', subtitle: 'Logo marquee'}),
  },
})

const intro = defineType({
  name: 'introSection',
  title: 'Intro with collage',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'lede', title: 'Text', type: 'text', rows: 4}),
    defineField({
      name: 'facts',
      title: 'Facts',
      type: 'array',
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'fact',
          fields: [
            defineField({name: 'key', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'string'}),
          ],
          preview: {select: {title: 'key', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({name: 'button', title: 'Button', type: 'link'}),
    defineField({
      name: 'images',
      title: 'Collage images (up to three)',
      type: 'array',
      validation: (r) => r.max(3),
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
    }),
    defineField({name: 'sealText', title: 'Rotating seal text', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Intro', subtitle: 'Intro with collage'}),
  },
})

const range = defineType({
  name: 'rangeSection',
  title: 'Product range',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'lede', title: 'Text', type: 'text', rows: 2}),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Range', subtitle: 'Product range'}),
  },
})

const story = defineType({
  name: 'storySection',
  title: 'Numbered story',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'accent',
      title: 'Heading, italic part',
      type: 'string',
      description: 'Optional. Continues the heading in italics.',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Rail (cards that scroll sideways)', value: 'rail'},
          {title: 'Chapters (large, alternating sides)', value: 'chapters'},
        ],
        layout: 'radio',
      },
      initialValue: 'rail',
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
            defineField({
              name: 'illustration',
              title: 'Drawing',
              type: 'string',
              description: 'A line drawing shown when no image is set.',
              options: {
                list: [
                  {title: 'Ice sheet', value: 'ice'},
                  {title: 'Sand ridge', value: 'ridges'},
                  {title: 'Rain and snow', value: 'rain'},
                  {title: 'Filtering ground', value: 'filter'},
                  {title: 'Soft water drop', value: 'soft'},
                  {title: "Ahti's crown", value: 'ahti'},
                ],
              },
            }),
            image('image', 'Image (optional, replaces the drawing)'),
          ],
          preview: {select: {title: 'title', subtitle: 'text', media: 'image'}},
        }),
      ],
    }),
    defineField({name: 'button', title: 'Button', type: 'link'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Story', subtitle: 'Numbered story'}),
  },
})

const social = defineType({
  name: 'socialSection',
  title: 'Social gallery',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'handle', title: 'Handle', type: 'link'}),
    defineField({
      name: 'items',
      title: 'Posts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialItem',
          fields: [
            image('image', 'Image'),
            defineField({name: 'caption', title: 'Caption', type: 'string'}),
            defineField({
              name: 'href',
              title: 'Post address',
              type: 'string',
              validation: (r) => r.custom(hrefFormat),
            }),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  {title: 'Large', value: 'lg'},
                  {title: 'Medium', value: 'md'},
                ],
                layout: 'radio',
              },
              initialValue: 'lg',
            }),
          ],
          preview: {select: {title: 'caption', subtitle: 'size', media: 'image'}},
        }),
      ],
    }),
    defineField({name: 'followTitle', title: 'Follow tile title', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Social', subtitle: 'Social gallery'}),
  },
})

const cards = defineType({
  name: 'cardsSection',
  title: 'Link cards',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'linkCard',
          fields: [
            image('image', 'Image'),
            defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
            defineField({
              name: 'href',
              title: 'Address',
              type: 'string',
              validation: (r) => r.custom(hrefFormat),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'eyebrow', media: 'image'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Cards', subtitle: 'Link cards'}),
  },
})

export const sectionTypes = [hero, pageHero, split, marquee, intro, range, story, social, cards]
