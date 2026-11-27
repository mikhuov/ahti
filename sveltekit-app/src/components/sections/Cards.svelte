<script lang="ts">
  import {imageSrc} from '$lib/sanity/image'
  import type {CardsSection} from '$lib/sanity/types'
  import {hrefOf} from '$lib/utils/links'
  import Arrow from '../Arrow.svelte'

  let {section}: {section: CardsSection} = $props()
</script>

<section class="cards" data-section="cardsSection">
  <div class="wrap">
    {#if section.heading}<h2 class="h2 cards__title">{section.heading}</h2>{/if}
    <ul class="cards__grid">
      {#each section.cards ?? [] as card (card._key)}
        {@const src = imageSrc(card.image, 900, 675)}
        <li class="cards__card">
          <a href={hrefOf(card.href)}>
            <span class="cards__img">
              {#if src}<img {src} alt="" loading="lazy" />{/if}
            </span>
            <span class="cards__body">
              {#if card.eyebrow}<span class="eyebrow">{card.eyebrow}</span>{/if}
              <span class="cards__t">{card.title}</span>
              <span class="cards__d">{card.text}</span>
              <span class="round round--ink"><Arrow /></span>
            </span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .cards {
    padding: 0 0 clamp(80px, 9vw, 140px);
  }

  .cards__title {
    margin-bottom: clamp(28px, 3.4vw, 48px);
  }

  .cards__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(14px, 1.6vw, 24px);
  }

  .cards__card > a {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: var(--r-lg);
    overflow: hidden;
    background: #fff;
    border: 1px solid var(--ahti-line);
    transition:
      transform 0.7s var(--ease),
      box-shadow 0.7s var(--ease);
  }

  .cards__card > a:hover {
    transform: translateY(-4px);
    box-shadow: 0 30px 60px -40px #12131566;
  }

  .cards__img {
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--ahti-mist);
  }

  .cards__img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.2s var(--ease);
  }

  .cards__card > a:hover .cards__img img {
    transform: scale(1.04);
  }

  .cards__body {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 22px 76px 26px 22px;
  }

  .cards__t {
    margin-top: 10px;
    font: 400 clamp(24px, 2vw, 30px) / 1.1 var(--ahti-display);
    letter-spacing: -0.02em;
  }

  .cards__d {
    margin-top: 8px;
    font: 400 15px/1.5 var(--ahti-sans);
    color: var(--ahti-ink-2);
  }

  .cards__body .round {
    position: absolute;
    right: 20px;
    bottom: 24px;
  }

  @media (max-width: 989px) {
    .cards__grid {
      grid-template-columns: 1fr;
    }

    .cards__img {
      aspect-ratio: 16 / 9;
    }
  }
</style>
