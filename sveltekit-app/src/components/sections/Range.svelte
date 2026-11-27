<script lang="ts">
  import type {ProductCard as Product, RangeSection} from '$lib/sanity/types'
  import ProductCard from '../ProductCard.svelte'

  let {section}: {section: RangeSection} = $props()

  const products = $derived((section.products ?? []).filter((p): p is Product => Boolean(p)))
</script>

<section class="range" id="range" data-section="rangeSection">
  <div class="wrap range__head">
    <div>
      {#if section.eyebrow}<p class="eyebrow">{section.eyebrow}</p>{/if}
      {#if section.heading}<h2 class="h2">{section.heading}</h2>{/if}
    </div>
    {#if section.lede}<p class="lede">{section.lede}</p>{/if}
  </div>
  <div class="range__viewport">
    <ul class="range__track rail">
      {#each products as product (product._id)}
        <ProductCard {product} />
      {/each}
    </ul>
  </div>
</section>

<style>
  .range {
    padding: 0 0 clamp(80px, 9vw, 140px);
  }

  .range__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 32px;
    margin-bottom: clamp(28px, 3.4vw, 48px);
  }

  .range__head .lede {
    max-width: 38ch;
  }

  .range__viewport {
    max-width: var(--maxw);
    margin: 0 auto;
    padding: 0 var(--gutter);
  }

  .range__track {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(14px, 1.6vw, 24px);
  }

  @media (max-width: 989px) {
    .range__head {
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
    }

    .range__head .lede {
      margin-top: 18px;
    }

    .range__viewport {
      padding: 0;
    }

    .range__track {
      grid-template-columns: none;
      grid-auto-flow: column;
      grid-auto-columns: min(80vw, 420px);
      padding: 0 var(--gutter);
      scroll-padding: 0 var(--gutter);
    }
  }
</style>
