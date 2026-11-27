<script lang="ts">
  import {afterNavigate} from '$app/navigation'
  import {useQuery} from '@sanity/sveltekit'
  import type {Snippet} from 'svelte'
  import type {SiteSettings} from '$lib/sanity/types'
  import {setSiteSettings} from '$lib/siteSettings'
  import AnnouncementBar from './AnnouncementBar.svelte'
  import Footer from './Footer.svelte'
  import Header from './Header.svelte'
  import OfferPill from './OfferPill.svelte'

  let {loaded, children}: {loaded: Parameters<typeof useQuery>[0]; children: Snippet} = $props()

  const query = $derived(useQuery(loaded))

  function matchOverscroll() {
    const root = document.documentElement
    const nearBottom = window.scrollY > (root.scrollHeight - window.innerHeight) / 2
    root.style.backgroundColor = nearBottom ? 'var(--ahti-ink)' : ''
  }

  afterNavigate(matchOverscroll)

  $effect(() => {
    document.addEventListener('click', smoothAnchors)
    return () => document.removeEventListener('click', smoothAnchors)
  })

  $effect(() => {
    matchOverscroll()
    window.addEventListener('scroll', matchOverscroll, {passive: true})
    window.addEventListener('resize', matchOverscroll)
    return () => {
      window.removeEventListener('scroll', matchOverscroll)
      window.removeEventListener('resize', matchOverscroll)
      document.documentElement.style.backgroundColor = ''
    }
  })

  function smoothAnchors(event: MouseEvent) {
    const link = (event.target as Element).closest?.('a[href*="#"]') as HTMLAnchorElement | null
    if (!link || link.origin !== location.origin || link.pathname !== location.pathname) return
    const target = link.hash.length > 1 && document.getElementById(link.hash.slice(1))
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({behavior: 'smooth'})
    history.pushState(history.state, '', link.hash)
  }
  const settings = $derived($query.data as SiteSettings | null | undefined)

  setSiteSettings(() => settings)
</script>

<div class="ahti">
  <AnnouncementBar text={settings?.announcement} />
  <Header {settings} />
  <main>
    {@render children()}
  </main>
  <Footer {settings} />
  <OfferPill {settings} />
</div>
