<script lang="ts">
  import {addToCart} from '$lib/cart.svelte'
  import type {ProductCard} from '$lib/sanity/types'
  import {productHref} from '$lib/utils/links'
  import {formatPrice} from '$lib/utils/price'
  import Arrow from './Arrow.svelte'
  import CanStage from './CanStage.svelte'

  let {product}: {product: ProductCard} = $props()

  const href = $derived(productHref(product.slug))
</script>

<li class="card">
  <a class="card__stage" {href} aria-label={product.name}>
    <CanStage {product} />
  </a>
  <div class="card__info">
    <div class="card__row">
      <h3 class="card__name" class:is-italic={product.italicName}>
        <a {href}>{product.name}</a>
      </h3>
      {#if formatPrice(product.pricePerCan)}
        <p class="card__price">
          {formatPrice(product.pricePerCan)} <small>{product.perCanLabel}</small>
        </p>
      {/if}
    </div>
    {#if product.description}<p class="card__desc">{product.description}</p>{/if}
    {#if product.footnote}<p class="card__note">{product.footnote}</p>{/if}
    <div class="card__actions">
      {#if product.addLabel}
        <button class="btn card__add" type="button" onclick={() => addToCart(12)}>
          {product.addLabel}
          <i><Arrow direction="plus" /></i>
        </button>
      {/if}
      {#if product.moreLabel}<a class="tlink" {href}>{product.moreLabel}</a>{/if}
    </div>
  </div>
</li>

<style>
  .card {
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
  }

  .card__stage {
    display: block;
    border-radius: var(--r-lg);
    overflow: hidden;
    transform: translateZ(0);
  }

  .card__info {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px 4px 0;
  }

  .card__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  .card__name {
    font: 400 clamp(28px, 2.4vw, 36px) / 1 var(--ahti-display);
    letter-spacing: -0.02em;
  }

  .card__name.is-italic {
    font-style: italic;
    font-weight: 330;
    letter-spacing: -0.03em;
  }

  .card__price {
    font: 500 15px/1 var(--ahti-sans);
    font-variant-numeric: tabular-nums;
    color: var(--ahti-ink-2);
    white-space: nowrap;
  }

  .card__price small {
    font-size: 12.5px;
    color: var(--ahti-ink-3);
    letter-spacing: 0.04em;
  }

  .card__desc {
    margin-top: 8px;
    font: 400 15px/1.5 var(--ahti-sans);
    color: var(--ahti-ink-2);
  }

  .card__note {
    margin-top: 12px;
    font: italic 400 14.5px/1.4 var(--ahti-display);
    color: var(--ahti-ink-2);
  }

  .card__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 20px;
    margin-top: auto;
    padding-top: 18px;
  }

  .card__add {
    min-height: 48px;
    padding: 6px 6px 6px 22px;
    font-size: 14.5px;
  }

  .card__add :global(i) {
    width: 36px;
    height: 36px;
  }
</style>
