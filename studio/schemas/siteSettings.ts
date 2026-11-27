import {defineArrayMember, defineField, defineType} from 'sanity'

const links = (name: string, title: string, group: string) =>
  defineField({name, title, group, type: 'array', of: [defineArrayMember({type: 'link'})]})

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    {name: 'header', title: 'Header', default: true},
    {name: 'product', title: 'Product pages'},
    {name: 'offer', title: 'Floating offer'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      description: 'Used in browser tab titles, breadcrumbs and as the logo\'s text alternative.',
      group: 'header',
    }),
    defineField({name: 'announcement', title: 'Announcement bar', type: 'string', group: 'header'}),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'header',
    }),
    defineField({name: 'shopLabel', title: 'Shop menu label', type: 'string', group: 'header'}),
    defineField({name: 'shopMenuTitle', title: 'Shop menu side title', type: 'string', group: 'header'}),
    defineField({
      name: 'priceFromLabel',
      title: 'Word before prices in the Shop menu',
      type: 'string',
      description: 'Shown before each product\'s cheapest pack price, as in "From €21,49".',
      group: 'header',
    }),
    links('shopMenuLinks', 'Shop menu side links', 'header'),
    defineField({name: 'menuLabel', title: 'Mobile menu label', type: 'string', group: 'header'}),
    links('navLeft', 'Left navigation', 'header'),
    links('navRight', 'Right navigation', 'header'),
    defineField({
      name: 'moreProductsHeading',
      title: 'Heading above other products',
      type: 'string',
      group: 'product',
    }),
    defineField({name: 'offerEnabled', title: 'Show floating offer', type: 'boolean', group: 'offer'}),
    defineField({name: 'offer', title: 'Offer', type: 'link', group: 'offer'}),
    defineField({name: 'footerTagline', title: 'Tagline', type: 'text', rows: 2, group: 'footer'}),
    defineField({name: 'footerButton', title: 'Button', type: 'link', group: 'footer'}),
    defineField({
      name: 'footerColumns',
      title: 'Link columns',
      group: 'footer',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [defineArrayMember({type: 'link'})],
            }),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({name: 'legal', title: 'Legal line', type: 'string', group: 'footer'}),
    defineField({name: 'footerNote', title: 'Closing note', type: 'string', group: 'footer'}),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
