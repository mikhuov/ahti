<script lang="ts">
  import {imageSrc} from '$lib/sanity/image'
  import type {PageHeroSection} from '$lib/sanity/types'
  import Button from '../Button.svelte'

  let {section}: {section: PageHeroSection} = $props()

  const src = $derived(
    section.wide ? imageSrc(section.image, 2200, 943) : imageSrc(section.image, 1200, 1500),
  )
</script>

<section class="ph" class:ph--wide={section.wide} data-section="pageHeroSection">
  <div class="wrap ph__grid">
    <div class="ph__copy">
      {#if section.eyebrow}<p class="eyebrow">{section.eyebrow}</p>{/if}
      <h1 class="ph__title">
        {section.heading}
        {#if section.accent}<em>{section.accent}</em>{/if}
      </h1>
      {#if section.lede}<p class="lede">{section.lede}</p>{/if}
      <Button link={section.button} />
    </div>
    <div class="ph__frame">
      {#if src}<img {src} alt="" fetchpriority="high" />{/if}
    </div>
  </div>
</section>

<style>
  .ph {
    padding: clamp(36px, 5vw, 80px) 0 clamp(56px, 7vw, 112px);
  }

  .ph__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(36px, 6vw, 110px);
    align-items: center;
  }

  .ph__title {
    font: 330 clamp(52px, 6.6vw, 112px) / 0.95 var(--ahti-display);
    letter-spacing: -0.04em;
    margin-top: 18px;
    text-wrap: balance;
  }

  .ph__title em {
    font-style: italic;
    letter-spacing: -0.03em;
  }

  .ph__copy .lede {
    margin-top: 26px;
    font-size: clamp(17px, 1.3vw, 20px);
    max-width: 40ch;
  }

  .ph__copy :global(.btn) {
    margin-top: 32px;
  }

  .ph__frame {
    position: relative;
    aspect-ratio: 4 / 5;
    border-radius: var(--r-xl);
    overflow: hidden;
    background: var(--ahti-mist);
  }

  .ph__frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ph--wide .ph__grid {
    grid-template-columns: 1fr;
    gap: clamp(28px, 4vw, 56px);
  }

  .ph--wide .ph__frame {
    aspect-ratio: 21 / 9;
  }

  .ph--wide .ph__copy {
    max-width: 980px;
  }

  @media (max-width: 989px) {
    .ph__grid {
      grid-template-columns: 1fr;
    }

    .ph__frame {
      aspect-ratio: 4 / 4.2;
    }

    .ph--wide .ph__frame {
      aspect-ratio: 4 / 3;
    }
  }
</style>
