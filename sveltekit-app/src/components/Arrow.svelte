<script lang="ts">
  let {direction = 'right'}: {direction?: 'right' | 'left' | 'plus' | 'close'} = $props()
</script>

<svg viewBox="0 0 24 24" aria-hidden="true">
  {#if direction === 'plus'}
    <path d="M12 5v14M5 12h14" />
  {:else if direction === 'close'}
    <path d="M6 6l12 12M18 6L6 18" />
  {:else if direction === 'left'}
    <path d="M19 12H5M11 6l-6 6 6 6" />
  {:else}
    <path d="M5 12h14M13 6l6 6-6 6" />
  {/if}
</svg>
