<script lang="ts">
  import type {Link} from '$lib/sanity/types'
  import {hrefOf, isExternal} from '$lib/utils/links'
  import Arrow from './Arrow.svelte'

  let {
    link,
    variant = 'ink',
  }: {link?: Link; variant?: 'ink' | 'ghost' | 'light'} = $props()
</script>

{#if link?.label}
  <a
    class="btn btn--{variant}"
    href={hrefOf(link.href)}
    target={isExternal(link.href) ? '_blank' : undefined}
    rel={isExternal(link.href) ? 'noopener' : undefined}
  >
    {link.label}
    <i><Arrow /></i>
  </a>
{/if}
