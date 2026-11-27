<script lang="ts">
  import {getSiteSettings} from '$lib/siteSettings'
  import {imageSrc} from '$lib/sanity/image'
  import type {SocialSection} from '$lib/sanity/types'
  import {clean, hrefOf} from '$lib/utils/links'
  import RailArrows from '../RailArrows.svelte'

  const site = getSiteSettings()

  let {section}: {section: SocialSection} = $props()

  let rail = $state<HTMLElement>()
  const handleHref = $derived(hrefOf(section.handle?.href))
</script>

<section class="social" data-section="socialSection">
  <div class="wrap social__head">
    <div>
      {#if section.eyebrow}<p class="eyebrow">{section.eyebrow}</p>{/if}
      {#if section.heading}<h2 class="h2">{section.heading}</h2>{/if}
    </div>
    <div class="social__ctrl">
      {#if section.handle?.label}
        <a class="tlink" href={handleHref} target="_blank" rel="noopener">{section.handle.label}</a>
      {/if}
      <RailArrows {rail} label={section.eyebrow ?? 'gallery'} />
    </div>
  </div>

  <ul class="social__track rail" bind:this={rail}>
    {#each section.items ?? [] as item (item._key)}
      {@const size = clean(item.size) === 'md' ? 'md' : 'lg'}
      {@const src = imageSrc(item.image, 800, size === 'md' ? 1067 : 1000)}
      <li class="social__item social__item--{size}">
        <a class="social__frame" href={hrefOf(item.href)} target="_blank" rel="noopener">
          {#if src}<img {src} alt={clean(item.caption) ?? ''} loading="lazy" />{/if}
          {#if item.caption}<span class="social__chip">{item.caption}</span>{/if}
        </a>
      </li>
    {/each}
    {#if section.followTitle}
      <li class="social__item social__item--follow">
        <a class="social__follow" href={handleHref} target="_blank" rel="noopener">
          <span class="social__badge" aria-hidden="true">{site()?.siteName?.charAt(0)}</span>
          <span class="social__follow-t">{section.followTitle}</span>
          <span class="social__follow-h">{section.handle?.label}</span>
        </a>
      </li>
    {/if}
  </ul>
</section>

<style>
  .social {
    --row: clamp(360px, 34vw, 500px);
    padding: clamp(80px, 9vw, 140px) 0;
    overflow: hidden;
  }

  .social__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: clamp(28px, 3.4vw, 48px);
  }

  .social__ctrl {
    display: flex;
    align-items: center;
    gap: 22px;
  }

  .social__track {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: var(--row);
    grid-auto-columns: max-content;
    gap: 18px;
    overflow-y: hidden;
    padding: 0 var(--gutter);
    scroll-padding: 0 var(--gutter);
    max-width: calc(var(--maxw) + 2 * var(--gutter));
    margin: 0 auto;
  }

  .social__item {
    scroll-snap-align: start;
    height: 100%;
  }

  .social__frame {
    position: relative;
    display: block;
    height: 100%;
    aspect-ratio: 4 / 5;
    border-radius: var(--r-md);
    overflow: hidden;
    background: var(--ahti-mist);
  }

  .social__item--md .social__frame {
    aspect-ratio: 3 / 4;
  }

  .social__frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.2s var(--ease);
  }

  .social__frame:hover img {
    transform: scale(1.04);
  }

  .social__chip {
    position: absolute;
    left: 12px;
    bottom: 12px;
    max-width: calc(100% - 24px);
    padding: 8px 12px;
    border-radius: 999px;
    background: #ffffffe6;
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    font: 600 12.5px/1.2 var(--ahti-sans);
    color: var(--ahti-ink);
  }

  .social__follow {
    height: 100%;
    aspect-ratio: 4 / 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 24px;
    border-radius: var(--r-md);
    background: var(--ahti-ink);
    color: #fff !important;
    text-align: center;
  }

  .social__badge {
    display: grid;
    place-items: center;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    background: #fff;
    color: var(--ahti-ink);
    font: 400 40px/1 var(--ahti-display);
  }

  .social__follow-t {
    font: 350 clamp(24px, 2vw, 30px) / 1.1 var(--ahti-display);
    letter-spacing: -0.02em;
    max-width: 12ch;
  }

  .social__follow-h {
    font: 500 14px/1 var(--ahti-sans);
    opacity: 0.7;
  }

  @media (max-width: 749px) {
    .social__ctrl :global(.arrows) {
      display: none;
    }

    .social__track {
      grid-auto-flow: row;
      grid-template-rows: none;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-columns: auto;
      gap: 8px;
      overflow: visible;
    }

    .social__item,
    .social__frame,
    .social__follow {
      height: auto;
    }

    .social__frame,
    .social__item--md .social__frame,
    .social__follow {
      aspect-ratio: 4 / 5;
      border-radius: 14px;
    }

    .social__item:first-child {
      grid-column: 1 / -1;
    }

    .social__item:first-child .social__frame {
      aspect-ratio: 4 / 3.4;
    }
  }
</style>
