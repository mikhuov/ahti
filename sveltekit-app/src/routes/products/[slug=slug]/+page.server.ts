import {error} from '@sveltejs/kit'
import {productPageQuery as query} from '$lib/sanity/queries'
import type {ProductPage} from '$lib/sanity/types'
import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({locals, params}) => {
  const {slug} = params
  const initial = await locals.sanity.loadQuery<ProductPage>(query, {slug})
  if (!initial.data?.product) error(404, 'Product not found')

  return {query, params: {slug}, options: {initial}}
}
