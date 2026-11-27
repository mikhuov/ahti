import {defineField, defineType} from 'sanity'

import {hrefFormat} from './rules'

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({
      name: 'href',
      title: 'Address',
      type: 'string',
      description: 'A path on this site (/products/ahti-vadelma) or a full web address.',
      validation: (r) => r.custom(hrefFormat),
    }),
  ],
})
