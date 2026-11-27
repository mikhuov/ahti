<script lang="ts">
  let {text}: {text?: string} = $props()
</script>

{#if text}
  <div class="bar" data-section="announcement">
    <p>{text}</p>
  </div>
{/if}

<style>
  .bar {
    background: var(--ahti-paper);
    border-bottom: 1px solid var(--ahti-line);
    padding: 9px var(--gutter);
    text-align: center;
  }

  p {
    font: 500 13px/1.4 var(--ahti-sans);
    letter-spacing: 0.02em;
    color: var(--ahti-ink);
  }
</style>
