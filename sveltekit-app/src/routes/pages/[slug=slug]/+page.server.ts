import {error} from '@sveltejs/kit'
import {contentPageQuery as query} from '$lib/sanity/queries'
import type {ContentPage} from '$lib/sanity/types'
import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({locals, params}) => {
  const {slug} = params
  const initial = await locals.sanity.loadQuery<ContentPage | null>(query, {slug})
  if (!initial.data) error(404, 'Page not found')

  return {query, params: {slug}, options: {initial}}
}
