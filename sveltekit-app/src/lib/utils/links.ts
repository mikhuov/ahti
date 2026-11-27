import {resolve} from '$app/paths'
import {stegaClean} from '@sanity/sveltekit'

export function clean<T>(value: T): T {
  return stegaClean(value) as T
}

const safeHref = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i

export function hrefOf(href: string | undefined): string {
  const value = clean(href)?.trim()
  return value && safeHref.test(value) ? value : '#'
}

export function isExternal(href: string | undefined): boolean {
  return /^https?:\/\//.test(clean(href) ?? '')
}

export function homeHref(anchor?: string): string {
  return anchor ? `${resolve('/')}#${anchor}` : resolve('/')
}

export function productHref(slug: string | undefined): string {
  const s = clean(slug)
  return s ? resolve('/products/[slug=slug]', {slug: s}) : '#'
}
