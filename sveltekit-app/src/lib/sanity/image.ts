import {createImageUrlBuilder} from '@sanity/image-url'
import type {Image} from '@sanity/types'
import {client} from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: Image) {
  return builder.image(source)
}

export function imageSrc(source: Image | undefined, width: number, height?: number) {
  if (!source?.asset) return undefined
  let url = builder.image(source).width(width).auto('format').fit('crop')
  if (height) url = url.height(height)
  return url.url()
}
