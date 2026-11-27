import type {SlugValue} from 'sanity'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const hrefPattern = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i

export function slugFormat(slug: SlugValue | undefined) {
  if (!slug?.current) return true
  return (
    slugPattern.test(slug.current) ||
    'Use lowercase letters, numbers and single dashes only, for example our-story.'
  )
}

export function hrefFormat(href: string | undefined) {
  if (!href?.trim()) return true
  return (
    hrefPattern.test(href.trim()) ||
    'Start with / for a page on this site, # for a section, or https://, mailto: or tel:.'
  )
}
