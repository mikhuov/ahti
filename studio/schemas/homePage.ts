import {defineArrayMember, defineField, defineType} from 'sanity'

import {sectionTypes} from './sections'

export default defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Browser tab title',
      type: 'string',
      description: 'Shown in the browser tab and in search results.',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      description: 'Drag to reorder. Each section appears on the home page in this order.',
      type: 'array',
      of: sectionTypes.map((s) => defineArrayMember({type: s.name})),
    }),
  ],
  preview: {prepare: () => ({title: 'Home page'})},
})
