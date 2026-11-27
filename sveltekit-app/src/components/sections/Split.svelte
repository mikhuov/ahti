<script lang="ts">
  import {imageSrc} from '$lib/sanity/image'
  import type {ProductCard, SplitSection} from '$lib/sanity/types'
  import {clean, productHref} from '$lib/utils/links'
  import Button from '../Button.svelte'
  import CanArt from '../CanArt.svelte'

  let {section}: {section: SplitSection} = $props()

  const cans = $derived(clean(section.media) === 'cans')
  const paragraphs = $derived(
    (section.body ?? '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  )
  const products = $derived((section.products ?? []).filter((p): p is ProductCard => Boolean(p)))
  const src = $derived(imageSrc(section.image, 1100, 1375))
</script>

<section class="split" class:split--flip={section.flip} data-section="splitSection">
  <div class="wrap split__grid">
    <div class="split__copy">
      {#if section.eyebrow}<p class="eyebrow">{section.eyebrow}</p>{/if}
      {#if section.heading}
        <h2 class="h2">
          {section.heading}
          {#if section.accent}<em>{section.accent}</em>{/if}
        </h2>
      {/if}
      {#if paragraphs.length}
        <div class="split__text">
          {#each paragraphs as paragraph, i (i)}<p>{paragraph}</p>{/each}
        </div>
      {/if}
      <Button link={section.button} />
    </div>

    <figure class="split__media">
      {#if cans}
        <div class="split__cans">
          {#each products as product (product._id)}
            <a class="split__can" href={productHref(product.slug)} aria-label={product.name}>
              <CanArt name={product.name} tone={product.tone} italic={product.italicName} />
            </a>
          {/each}
        </div>
      {:else}
        <div class="split__frame">
          {#if src}<img {src} alt="" loading="lazy" />{/if}
        </div>
        {#if section.caption}<figcaption>{section.caption}</figcaption>{/if}
      {/if}
    </figure>
  </div>
</section>

<style>
  .split {
    padding: clamp(56px, 7vw, 112px) 0;
  }

  .split__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(36px, 7vw, 130px);
    align-items: center;
  }

  .split--flip .split__media {
    order: -1;
  }

  .split__copy .h2 em {
    font-style: italic;
    font-weight: 330;
    letter-spacing: -0.03em;
  }

  .split__text {
    margin-top: 22px;
  }

  .split__text p {
    font: 400 17px/1.7 var(--ahti-sans);
    color: var(--ahti-ink-2);
    max-width: 50ch;
    margin: 0 0 14px;
  }

  .split__text p:last-child {
    margin-bottom: 0;
  }

  .split__copy :global(.btn) {
    margin-top: 28px;
  }

  .split__frame {
    position: relative;
    aspect-ratio: 4 / 5;
    border-radius: var(--r-xl);
    overflow: hidden;
    background: var(--ahti-mist);
  }

  .split__frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  figcaption {
    margin-top: 12px;
    font: 400 13px/1.4 var(--ahti-sans);
    color: var(--ahti-ink-3);
  }

  .split__cans {
    aspect-ratio: 4 / 4.4;
    border-radius: var(--r-xl);
    background:
      radial-gradient(70% 55% at 50% 88%, #fff, #fff0),
      var(--ahti-mist);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 1.5%;
    padding: 0 4% 14%;
  }

  .split__can {
    flex: 0 0 31%;
    aspect-ratio: 120 / 200;
    display: block;
    transition: transform 0.7s var(--ease);
  }

  .split__can:nth-child(2) {
    transform: translateY(-5%);
  }

  .split__can:hover {
    transform: translateY(-3%);
  }

  .split__can:nth-child(2):hover {
    transform: translateY(-8%);
  }

  @media (max-width: 989px) {
    .split__grid {
      grid-template-columns: 1fr;
    }

    .split--flip .split__media {
      order: 0;
    }
  }
</style>
