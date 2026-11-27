<script lang="ts">
  import {useQuery} from '@sanity/sveltekit'
  import Sections from '../components/Sections.svelte'
  import type {HomePage} from '$lib/sanity/types'
  import {getSiteSettings} from '$lib/siteSettings'
  import {clean} from '$lib/utils/links'
  import type {PageProps} from './$types'

  const {data}: PageProps = $props()
  const query = $derived(useQuery(data))
  const home = $derived($query.data as HomePage | null | undefined)
  const site = getSiteSettings()
</script>

<svelte:head>
  <title>{clean(home?.title) || clean(site()?.siteName) || ''}</title>
</svelte:head>

<Sections sections={home?.sections} />
