import {createContext} from 'svelte'
import type {SiteSettings} from '$lib/sanity/types'

export const [getSiteSettings, setSiteSettings] =
  createContext<() => SiteSettings | null | undefined>()
