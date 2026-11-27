import {defineArrayMember, defineField, defineType} from 'sanity'

import {slugFormat} from './rules'
import {sectionTypes} from './sections'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required().custom(slugFormat),
    }),
    defineField({name: 'description', title: 'Search description', type: 'text', rows: 2}),
    defineField({
      name: 'sections',
      title: 'Sections',
      description: 'Drag to reorder. Each section appears on the page in this order.',
      type: 'array',
      of: sectionTypes.map((s) => defineArrayMember({type: s.name})),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
