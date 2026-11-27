import type {Image} from '@sanity/types'

export type {Image}

export interface Link {
  _key?: string
  label?: string
  href?: string
}

export type Tone = 'still' | 'sparkling' | 'vadelma'

export interface ProductCard {
  _id: string
  name?: string
  slug?: string
  italicName?: boolean
  tone?: Tone
  tagline?: string
  description?: string
  footnote?: string
  pricePerCan?: number
  perCanLabel?: string
  fromPrice?: number | null
  addLabel?: string
  moreLabel?: string
  image?: Image
  backdrop?: Image
}

export interface Product extends ProductCard {
  intro?: string
  sizes?: {_key: string; label?: string; pack?: string; price?: number}[]
  plans?: {_key: string; label?: string; badge?: string; note?: string}[]
  buyLabel?: string
  assurance?: string
  specs?: {_key: string; key?: string; value?: string}[]
}

interface SectionBase<T extends string> {
  _type: T
  _key: string
}

export interface HeroSection extends SectionBase<'heroSection'> {
  eyebrow?: string
  titleLines?: string[]
  aside?: string
  button?: Link
  image?: Image
}

export interface PageHeroSection extends SectionBase<'pageHeroSection'> {
  eyebrow?: string
  heading?: string
  accent?: string
  lede?: string
  button?: Link
  image?: Image
  wide?: boolean
}

export interface SplitSection extends SectionBase<'splitSection'> {
  eyebrow?: string
  heading?: string
  accent?: string
  body?: string
  button?: Link
  media?: 'image' | 'cans'
  image?: Image
  caption?: string
  products?: (ProductCard | null)[]
  flip?: boolean
}

export interface MarqueeSection extends SectionBase<'marqueeSection'> {
  label?: string
  items?: {_key: string; name?: string; logo?: Image}[]
}

export interface IntroSection extends SectionBase<'introSection'> {
  eyebrow?: string
  heading?: string
  lede?: string
  facts?: {_key: string; key?: string; value?: string}[]
  button?: Link
  images?: (Image & {_key: string})[]
  sealText?: string
}

export interface RangeSection extends SectionBase<'rangeSection'> {
  eyebrow?: string
  heading?: string
  lede?: string
  products?: (ProductCard | null)[]
}

export interface StorySection extends SectionBase<'storySection'> {
  eyebrow?: string
  heading?: string
  accent?: string
  layout?: 'rail' | 'chapters'
  steps?: {_key: string; title?: string; text?: string; image?: Image; illustration?: string}[]
  button?: Link
}

export interface SocialSection extends SectionBase<'socialSection'> {
  eyebrow?: string
  heading?: string
  handle?: Link
  items?: {_key: string; image?: Image; caption?: string; href?: string; size?: 'lg' | 'md'}[]
  followTitle?: string
}

export interface CardsSection extends SectionBase<'cardsSection'> {
  heading?: string
  cards?: {
    _key: string
    image?: Image
    eyebrow?: string
    title?: string
    text?: string
    href?: string
  }[]
}

export type Section =
  | HeroSection
  | PageHeroSection
  | SplitSection
  | MarqueeSection
  | IntroSection
  | RangeSection
  | StorySection
  | SocialSection
  | CardsSection

export interface HomePage {
  title?: string
  sections?: Section[]
}

export interface ContentPage {
  title?: string
  description?: string
  sections?: Section[]
}

export interface SiteSettings {
  siteName?: string
  menuLabel?: string
  moreProductsHeading?: string
  announcement?: string
  logo?: Image
  shopLabel?: string
  shopMenuTitle?: string
  priceFromLabel?: string
  shopMenuLinks?: Link[]
  navLeft?: Link[]
  navRight?: Link[]
  offerEnabled?: boolean
  offer?: Link
  footerTagline?: string
  footerButton?: Link
  footerColumns?: {_key: string; title?: string; links?: Link[]}[]
  legal?: string
  footerNote?: string
  products?: ProductCard[]
}

export interface ProductPage {
  product: Product | null
  others: ProductCard[]
}
