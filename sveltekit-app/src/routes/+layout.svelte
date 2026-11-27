<script lang="ts">
  import {onNavigate} from '$app/navigation'
  import {PreviewMode, QueryLoader, VisualEditing} from '@sanity/sveltekit'
  import type {LayoutProps} from './$types'
  import SiteChrome from '../components/SiteChrome.svelte'
  import {client} from '$lib/sanity/client'
  const {children, data}: LayoutProps = $props()
  const previewEnabled = $derived(data.previewEnabled)

  onNavigate((navigation) => {
    if (!document.startViewTransition) return
    if (navigation.from?.url.pathname === navigation.to?.url.pathname) return

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })
</script>

<PreviewMode enabled={previewEnabled}>
  <VisualEditing enabled={previewEnabled}>
    <QueryLoader enabled={previewEnabled} {client}>
      <SiteChrome loaded={data.settings}>
        {@render children()}
      </SiteChrome>
    </QueryLoader>
  </VisualEditing>
</PreviewMode>
