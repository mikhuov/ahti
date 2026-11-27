<script lang="ts">
  import {imageSrc} from '$lib/sanity/image'
  import type {MarqueeSection} from '$lib/sanity/types'

  let {section}: {section: MarqueeSection} = $props()

  const items = $derived(section.items ?? [])
</script>

{#snippet group(hidden: boolean)}
  <ul class="mq__group" aria-hidden={hidden}>
    {#each items as item (item._key)}
      {@const logo = imageSrc(item.logo, 320)}
      <li class="mq__item">
        {#if logo}
          <img src={logo} alt={hidden ? '' : item.name} loading="lazy" />
        {:else}
          <span>{item.name}</span>
        {/if}
      </li>
    {/each}
  </ul>
{/snippet}

<section class="mq" data-section="marqueeSection">
  {#if section.label}<p class="mq__label">{section.label}</p>{/if}
  <div class="mq__viewport">
    <div class="mq__track">
      {@render group(false)}
      {@render group(true)}
    </div>
  </div>
</section>

<style>
  .mq {
    display: flex;
    align-items: center;
    gap: clamp(18px, 3vw, 48px);
    padding: 20px 0 20px var(--gutter);
    border-bottom: 1px solid var(--ahti-line);
    background: var(--ahti-paper);
    overflow: hidden;
  }

  .mq__label {
    flex: none;
    font: 600 11px/1.3 var(--ahti-sans);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ahti-ink-3);
    white-space: nowrap;
  }

  .mq__viewport {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
  }

  .mq__track {
    display: flex;
    width: max-content;
    animation: slide 42s linear infinite;
  }

  @keyframes slide {
    to {
      transform: translateX(-50%);
    }
  }

  .mq__group {
    display: flex;
    align-items: center;
    gap: clamp(44px, 5vw, 80px);
    padding: 0 clamp(22px, 2.5vw, 40px);
    flex: none;
  }

  .mq__item {
    flex: none;
    height: 30px;
    display: flex;
    align-items: center;
    opacity: 0.86;
    font: 500 19px/1 var(--ahti-display);
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  .mq__item:nth-child(even) {
    font: 600 13px/1 var(--ahti-sans);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .mq__item img {
    height: 100%;
    width: auto;
    max-width: none;
  }

  @media (max-width: 749px) {
    .mq {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      padding: 16px 0;
    }

    .mq__label {
      padding: 0 var(--gutter);
    }

    .mq__item {
      height: 24px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mq__viewport {
      overflow-x: auto;
    }
  }
</style>
