import {siteSettingsQuery as query} from '$lib/sanity/queries'
import type {SiteSettings} from '$lib/sanity/types'
import type {LayoutServerLoad} from './$types'

export const load: LayoutServerLoad = async ({locals}) => {
  const {previewEnabled, loadQuery} = locals.sanity
  const initial = await loadQuery<SiteSettings | null>(query)
  return {previewEnabled, settings: {query, options: {initial}}}
}
