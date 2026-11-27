<script lang="ts">
  import {useQuery} from '@sanity/sveltekit'
  import Arrow from '../../../components/Arrow.svelte'
  import CanStage from '../../../components/CanStage.svelte'
  import ProductCard from '../../../components/ProductCard.svelte'
  import {addToCart} from '$lib/cart.svelte'
  import type {ProductPage} from '$lib/sanity/types'
  import {getSiteSettings} from '$lib/siteSettings'
  import {clean, homeHref} from '$lib/utils/links'
  import {formatPrice} from '$lib/utils/price'
  import type {PageProps} from './$types'

  const {data}: PageProps = $props()
  const query = $derived(useQuery(data))
  const result = $derived($query.data as ProductPage | null | undefined)
  const product = $derived(result?.product)
  const site = getSiteSettings()

  let sizeIndex = $state(0)
  let planIndex = $state(0)

  const size = $derived(product?.sizes?.[sizeIndex])
  const plan = $derived(product?.plans?.[planIndex])
</script>

<svelte:head>
  <title>{[clean(product?.name), clean(site()?.siteName)].filter(Boolean).join(' · ')}</title>
</svelte:head>

{#if product}
  <section class="pdp" data-section="product">
    <div class="pdp__grid">
      <div class="pdp__media">
        <div class="pdp__media-in">
          <CanStage {product} eager />
          {#if size?.label}<span class="pdp__size-tag">{size.label}</span>{/if}
        </div>
      </div>

      <div class="pdp__panel">
        <nav class="pdp__crumbs" aria-label="Breadcrumb">
          <a href={homeHref()}>{site()?.siteName}</a><span>/</span><a href={homeHref('range')}
            >{site()?.shopLabel}</a><span>/</span>
          <span>{product.name}</span>
        </nav>

        <div class="pdp__title-row">
          <h1 class="pdp__name" class:is-italic={product.italicName}>{product.name}</h1>
          {#if product.sizes?.length}
            <fieldset class="pdp__sizes">
              <legend class="sr">Size</legend>
              {#each product.sizes as option, i (option._key)}
                <label class="pdp__pill">
                  <input type="radio" name="size" value={i} bind:group={sizeIndex} />
                  <span>{option.label}</span>
                </label>
              {/each}
            </fieldset>
          {/if}
        </div>

        {#if product.tagline}<p class="pdp__tag">{product.tagline}</p>{/if}
        {#if product.intro}<p class="pdp__intro">{product.intro}</p>{/if}
        {#if product.footnote}<p class="pdp__note">{product.footnote}</p>{/if}

        <p class="pdp__pack">
          {#if size?.pack}<span>{size.pack}</span>{/if}
          {#if formatPrice(size?.price)}<span>{formatPrice(size?.price)}</span>{/if}
          {#if formatPrice(product.pricePerCan)}
            <span>{formatPrice(product.pricePerCan)} {product.perCanLabel}</span>
          {/if}
        </p>

        {#if product.plans?.length}
          <fieldset class="pdp__plan">
            <legend class="sr">Purchase option</legend>
            {#each product.plans as option, i (option._key)}
              <label class="pdp__seg">
                <input type="radio" name="plan" value={i} bind:group={planIndex} />
                <span>{option.label}{#if option.badge}<em>{option.badge}</em>{/if}</span>
              </label>
            {/each}
          </fieldset>
          {#if plan?.note}<p class="pdp__plan-note">{plan.note}</p>{/if}
        {/if}

        {#if product.buyLabel}
          <button class="btn btn--block pdp__buy" type="button" onclick={() => addToCart(12)}>
            {product.buyLabel}
            <i><Arrow direction="plus" /></i>
          </button>
        {/if}

        {#if product.assurance}
          <p class="pdp__assure">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7.5" cy="17.5" r="1.8" />
              <circle cx="17.5" cy="17.5" r="1.8" />
            </svg>
            {product.assurance}
          </p>
        {/if}

        {#if product.specs?.length}
          <dl class="pdp__spec">
            {#each product.specs as spec (spec._key)}
              <div>
                <dt>{spec.key}</dt>
                <dd>{spec.value}</dd>
              </div>
            {/each}
          </dl>
        {/if}
      </div>
    </div>
  </section>

  {#if result?.others?.length}
    <section class="more">
      <div class="wrap">
        {#if site()?.moreProductsHeading}<h2 class="h2">{site()?.moreProductsHeading}</h2>{/if}
        <ul class="more__grid rail">
          {#each result.others as other (other._id)}
            <ProductCard product={other} />
          {/each}
        </ul>
      </div>
    </section>
  {/if}
{/if}

<style>
  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  .pdp {
    padding: clamp(16px, 2vw, 28px) 0 clamp(64px, 7vw, 112px);
  }

  .pdp__grid {
    max-width: var(--maxw);
    margin: 0 auto;
    padding: 0 var(--gutter);
    display: grid;
    grid-template-columns: minmax(0, 1.22fr) minmax(360px, 1fr);
    gap: clamp(32px, 5vw, 88px);
    align-items: start;
  }

  .pdp__media {
    min-width: 0;
    position: sticky;
    top: calc(var(--hdr-height) + 20px);
  }

  .pdp__media-in {
    position: relative;
    border: 1px solid var(--ahti-line);
    border-radius: var(--r-lg);
    overflow: hidden;
  }

  .pdp__size-tag {
    position: absolute;
    left: 18px;
    bottom: 18px;
    font: 600 12px/1 var(--ahti-sans);
    letter-spacing: 0.12em;
    color: var(--ahti-ink-2);
  }

  .pdp__panel {
    padding-top: 8px;
  }

  .pdp__crumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font: 500 13px/1.3 var(--ahti-sans);
    color: var(--ahti-ink-3);
    margin-bottom: 22px;
  }

  .pdp__crumbs a:hover {
    color: var(--ahti-ink);
  }

  .pdp__title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px 20px;
    flex-wrap: wrap;
  }

  .pdp__name {
    font: 340 clamp(48px, 5vw, 80px) / 0.96 var(--ahti-display);
    letter-spacing: -0.035em;
  }

  .pdp__name.is-italic {
    font-style: italic;
    font-weight: 330;
  }

  .pdp__sizes,
  .pdp__plan {
    border: 0;
    margin: 0;
    padding: 0;
  }

  .pdp__sizes {
    display: flex;
    gap: 8px;
  }

  .pdp__pill,
  .pdp__seg {
    position: relative;
    cursor: pointer;
  }

  .pdp__pill input,
  .pdp__seg input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  .pdp__pill span {
    display: inline-flex;
    align-items: center;
    height: 44px;
    padding: 0 20px;
    border-radius: 999px;
    border: 1px solid rgba(18, 19, 21, 0.18);
    background: #fff;
    font: 600 15px/1 var(--ahti-sans);
    color: var(--ahti-ink);
    transition:
      background-color 0.3s,
      color 0.3s,
      border-color 0.3s;
  }

  .pdp__pill:hover span {
    border-color: var(--ahti-ink);
  }

  .pdp__pill input:checked + span {
    background: var(--ahti-ink);
    color: #fff;
    border-color: var(--ahti-ink);
  }

  .pdp__pill input:focus-visible + span,
  .pdp__seg input:focus-visible + span {
    outline: 2px solid var(--ahti-ice);
    outline-offset: 2px;
  }

  .pdp__tag {
    margin-top: 14px;
    font: 600 12px/1.3 var(--ahti-sans);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ahti-ink-2);
  }

  .pdp__intro {
    margin-top: 18px;
    font: 400 17px/1.62 var(--ahti-sans);
    color: var(--ahti-ink-2);
    max-width: 46ch;
  }

  .pdp__note {
    margin-top: 14px;
    font: italic 400 16px/1.4 var(--ahti-display);
    color: var(--ahti-ink-2);
  }

  .pdp__pack {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: baseline;
    margin-top: 22px;
    font: 500 14px/1.3 var(--ahti-sans);
    color: var(--ahti-ink-2);
  }

  .pdp__pack span + span::before {
    content: '\b7';
    margin-right: 10px;
    color: var(--ahti-ink-3);
  }

  .pdp__plan {
    display: inline-flex;
    padding: 4px;
    margin-top: 18px;
    border-radius: 999px;
    background: var(--ahti-mist);
  }

  .pdp__seg span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 42px;
    padding: 0 20px;
    border-radius: 999px;
    font: 600 14.5px/1 var(--ahti-sans);
    color: var(--ahti-ink-2);
    transition:
      background-color 0.3s,
      color 0.3s,
      box-shadow 0.3s;
  }

  .pdp__seg span em {
    font-style: normal;
    color: var(--ahti-rasp);
  }

  .pdp__seg input:checked + span {
    background: #fff;
    color: var(--ahti-ink);
    box-shadow: 0 2px 8px -2px #1213152e;
  }

  .pdp__plan-note {
    margin-top: 10px;
    font: 400 13px/1.45 var(--ahti-sans);
    color: var(--ahti-ink-3);
  }

  .pdp__buy {
    margin-top: 18px;
  }

  .pdp__assure {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 18px;
    font: 400 14px/1.4 var(--ahti-sans);
    color: var(--ahti-ink-2);
  }

  .pdp__assure svg {
    width: 20px;
    height: 20px;
    flex: none;
    fill: none;
    stroke: var(--ahti-ink);
    stroke-width: 1.4;
    stroke-linejoin: round;
  }

  .pdp__spec {
    margin-top: 34px;
    border-top: 1px solid var(--ahti-ink);
  }

  .pdp__spec > div {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid var(--ahti-line);
  }

  .pdp__spec dt {
    font: 600 11.5px/1.5 var(--ahti-sans);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ahti-ink-2);
  }

  .pdp__spec dd {
    font: 400 15px/1.5 var(--ahti-sans);
    color: var(--ahti-ink);
  }

  .more {
    padding: 0 0 clamp(80px, 9vw, 140px);
  }

  .more__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(14px, 1.6vw, 24px);
    margin-top: clamp(28px, 3.4vw, 48px);
  }

  @media (max-width: 989px) {
    .pdp__grid {
      grid-template-columns: 1fr;
      padding: 0;
      gap: 28px;
    }

    .pdp__media {
      position: relative;
      top: auto;
    }

    .pdp__media-in {
      border-radius: 0;
      border-left: 0;
      border-right: 0;
    }

    .pdp__media-in :global(.stage) {
      border-radius: 0;
    }

    .pdp__panel {
      padding: 0 var(--gutter);
    }

    .pdp__name {
      font-size: clamp(48px, 13vw, 64px);
    }

    .more__grid {
      grid-template-columns: none;
      grid-auto-flow: column;
      grid-auto-columns: min(80vw, 420px);
    }
  }
</style>
