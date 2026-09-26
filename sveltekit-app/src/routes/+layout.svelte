<script lang="ts">
  import {PreviewMode, QueryLoader, VisualEditing} from '@sanity/sveltekit'
  import type {LayoutProps} from './$types'
  import {client} from '$lib/sanity/client'
  const {children, data}: LayoutProps = $props()
  // svelte-ignore state_referenced_locally -- previewEnabled only changes on full page reload
  const {previewEnabled} = data
</script>

<PreviewMode enabled={previewEnabled}>
  <VisualEditing enabled={previewEnabled}>
    <QueryLoader enabled={previewEnabled} {client}>
      {#if previewEnabled}
        <!-- Preview mode enabled -->
      {/if}

      <div class="container">
        <header class="header">
        </header>
        <main>
          {@render children()}
        </main>
      </div>
    </QueryLoader>
  </VisualEditing>
</PreviewMode>

<style>

</style>
