<script lang="ts">
  import {useQuery} from '@sanity/sveltekit'
  import Sections from '../../../components/Sections.svelte'
  import type {ContentPage} from '$lib/sanity/types'
  import {getSiteSettings} from '$lib/siteSettings'
  import {clean} from '$lib/utils/links'
  import type {PageProps} from './$types'

  const {data}: PageProps = $props()
  const query = $derived(useQuery(data))
  const page = $derived($query.data as ContentPage | null | undefined)
  const site = getSiteSettings()
</script>

<svelte:head>
  <title>{[clean(page?.title), clean(site()?.siteName)].filter(Boolean).join(' · ')}</title>
  {#if page?.description}<meta name="description" content={clean(page.description)} />{/if}
</svelte:head>

<Sections sections={page?.sections} />
