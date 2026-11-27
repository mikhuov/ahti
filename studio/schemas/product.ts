import {defineArrayMember, defineField, defineType} from 'sanity'

import {slugFormat} from './rules'

export const tones = [
  {title: 'Still (lake)', value: 'still'},
  {title: 'Sparkling (waterfall)', value: 'sparkling'},
  {title: 'Vadelma (raspberry)', value: 'vadelma'},
]

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (r) => r.required().custom(slugFormat),
    }),
    defineField({
      name: 'order',
      title: 'Menu order',
      type: 'number',
      description: 'Position in the Shop menu, lowest first.',
    }),
    defineField({
      name: 'italicName',
      title: 'Show name in italics',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tone',
      title: 'Water',
      type: 'string',
      description:
        'How the drawn can sits in its scene: standing on still water (with a reflection and ripples), or floating. Also the fallback colour when no backdrop image is set.',
      options: {list: tones, layout: 'radio'},
      initialValue: 'still',
    }),
    defineField({
      name: 'backdrop',
      title: 'Backdrop image',
      type: 'image',
      description: 'The scene behind the drawn can, such as a lake or a waterfall. Square works best.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'image',
      title: 'Product image',
      type: 'image',
      description: 'Optional. A finished product photo; replaces both the drawn can and the backdrop.',
      options: {hotspot: true},
    }),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'description', title: 'Card description', type: 'text', rows: 2}),
    defineField({name: 'intro', title: 'Product page intro', type: 'text', rows: 4}),
    defineField({name: 'footnote', title: 'Footnote', type: 'string'}),
    defineField({
      name: 'pricePerCan',
      title: 'Price per can (€)',
      type: 'number',
      description: 'In euros, for example 1.99. The site formats it as €1,99.',
      validation: (r) => r.min(0).precision(2),
    }),
    defineField({name: 'perCanLabel', title: 'Per-can label', type: 'string'}),
    defineField({name: 'addLabel', title: 'Quick-add button label', type: 'string'}),
    defineField({name: 'moreLabel', title: 'Product page link label', type: 'string'}),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'size',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'pack', title: 'Pack', type: 'string'}),
            defineField({
              name: 'price',
              title: 'Pack price (€)',
              type: 'number',
              description: 'In euros, for example 23.89. The cheapest pack is the "From" price in the Shop menu.',
              validation: (r) => r.min(0).precision(2),
            })
          ],
          preview: {select: {title: 'label', subtitle: 'pack'}},
        }),
      ],
    }),
    defineField({
      name: 'plans',
      title: 'Purchase options',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'plan',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'badge', title: 'Badge', type: 'string'}),
            defineField({name: 'note', title: 'Note shown when selected', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'badge'}},
        }),
      ],
    }),
    defineField({name: 'buyLabel', title: 'Buy button label', type: 'string'}),
    defineField({name: 'assurance', title: 'Assurance line', type: 'string'}),
    defineField({
      name: 'specs',
      title: 'Specifications',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'spec',
          fields: [
            defineField({name: 'key', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'string'}),
          ],
          preview: {select: {title: 'key', subtitle: 'value'}},
        }),
      ],
    }),
  ],
  orderings: [{title: 'Menu order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'tagline', media: 'image'}},
})
