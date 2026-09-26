import {postsQuery as query, type Post} from '$lib/sanity/queries'
import {toolbarQuery} from '$lib/sanity/queries'
import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({locals}) => {
  const {loadQuery} = locals.sanity
  const initial = await loadQuery<Post[]>(query)
  const toolbar = await loadQuery(toolbarQuery)

  // We pass the data in a format that is easy for `useQuery` to consume in the
  // corresponding `+page.svelte` file, but you can return the data in any
  // format you like.
  return {
    query,
    toolbar,
    options: {initial},
  }
}
