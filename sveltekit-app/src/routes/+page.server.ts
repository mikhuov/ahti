import {dev} from '$app/environment'
import {homePageQuery as query} from '$lib/sanity/queries'
import type {HomePage} from '$lib/sanity/types'
import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({locals, url}) => {
  const initial = await locals.sanity.loadQuery<HomePage | null>(query)

  if (dev && url.searchParams.get('smoke') === 'empty') {
    return {query, options: {initial: {...initial, data: null}}}
  }

  return {query, options: {initial}}
}
