import groq from 'groq'

const productCard = `{
  _id, name, "slug": slug.current, italicName, tone, tagline, description, footnote,
  pricePerCan, perCanLabel, "fromPrice": math::min(sizes[].price), addLabel, moreLabel, image,
  backdrop
}`

export const siteSettingsQuery = groq`*[_id == "siteSettings"][0]{
  ...,
  "products": *[_type == "product"] | order(order asc) ${productCard}
}`

const sections = `sections[]{
  ...,
  _type in ["rangeSection", "splitSection"] => {"products": products[]->${productCard}}
}`

export const homePageQuery = groq`*[_id == "homePage"][0]{..., ${sections}}`

export const contentPageQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  title, description, ${sections}
}`

export const productPageQuery = groq`{
  "product": *[_type == "product" && slug.current == $slug][0]{..., "slug": slug.current},
  "others": *[_type == "product" && slug.current != $slug] | order(order asc) ${productCard}
}`
