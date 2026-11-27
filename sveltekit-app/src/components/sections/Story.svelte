<script lang="ts">
  import {imageSrc} from '$lib/sanity/image'
  import type {StorySection} from '$lib/sanity/types'
  import {isStepArt} from '$lib/stepArt'
  import {clean} from '$lib/utils/links'
  import Button from '../Button.svelte'
  import RailArrows from '../RailArrows.svelte'
  import StepArt from '../StepArt.svelte'

  let {section}: {section: StorySection} = $props()

  let rail = $state<HTMLElement>()
  const chapters = $derived(clean(section.layout) === 'chapters')
  const steps = $derived(section.steps ?? [])
  const number = (i: number) => String(i + 1).padStart(2, '0')
</script>

{#snippet art(step: (typeof steps)[number], n: string)}
  {@const src = imageSrc(step.image, 1000, 750)}
  {@const drawing = clean(step.illustration)}
  <div class="story__art">
    {#if src}
      <img {src} alt="" loading="lazy" />
    {:else if isStepArt(drawing)}
      <StepArt name={drawing} />
    {:else}
      <svg viewBox="0 0 200 150" aria-hidden="true">
        {#each [0, 1, 2, 3] as r (r)}
          <ellipse cx="100" cy="112" rx={28 + r * 22} ry={5 + r * 4} />
        {/each}
        <text x="100" y="88" text-anchor="middle">{n}</text>
      </svg>
    {/if}
  </div>
{/snippet}

{#snippet heading()}
  <div>
    {#if section.eyebrow}<p class="eyebrow">{section.eyebrow}</p>{/if}
    {#if section.heading}
      <h2 class="h2">
        {section.heading}
        {#if section.accent}<em>{section.accent}</em>{/if}
      </h2>
    {/if}
  </div>
{/snippet}

<section class="story" class:story--chapters={chapters} data-section="storySection">
  {#if chapters}
    <div class="wrap">
      <div class="story__head">{@render heading()}</div>
      <ol class="story__steps">
        {#each steps as step, i (step._key)}
          <li class="story__step">
            {@render art(step, number(i))}
            <div class="story__txt">
              <span class="story__n">{number(i)}</span>
              <h3 class="story__t">{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </li>
        {/each}
      </ol>
    </div>
  {:else}
    <div class="wrap story__head">
      {@render heading()}
      <RailArrows {rail} label={section.eyebrow ?? 'story'} />
    </div>
    <div class="story__viewport">
      <ol class="story__rail rail" bind:this={rail}>
        {#each steps as step, i (step._key)}
          <li class="story__card">
            {@render art(step, number(i))}
            <span class="story__n">{number(i)}</span>
            <h3 class="story__t">{step.title}</h3>
            <p>{step.text}</p>
          </li>
        {/each}
      </ol>
    </div>
  {/if}

  {#if section.button?.label}
    <div class="wrap story__cta"><Button link={section.button} variant="ghost" /></div>
  {/if}
</section>

<style>
  .story {
    padding: clamp(72px, 8vw, 128px) 0;
    background: #fff;
    border-top: 1px solid var(--ahti-line);
    border-bottom: 1px solid var(--ahti-line);
  }

  .story__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: clamp(32px, 4vw, 56px);
  }

  .story__head .h2 {
    max-width: 16ch;
  }

  .story__head .h2 em {
    font-style: italic;
    font-weight: 330;
    letter-spacing: -0.03em;
  }

  .story__art {
    aspect-ratio: 4 / 3;
    border-radius: var(--r-md);
    background: #fff;
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .story__art img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .story__art svg {
    width: 86%;
    height: auto;
  }

  .story__art ellipse {
    fill: none;
    stroke: var(--ahti-ice);
    stroke-width: 0.8;
    opacity: 0.7;
  }

  .story__art text {
    font: 330 64px var(--ahti-display);
    letter-spacing: -0.03em;
    fill: var(--ahti-ice);
  }

  .story__cta {
    margin-top: 34px;
  }

  .story__viewport {
    max-width: var(--maxw);
    margin: 0 auto;
  }

  .story__rail {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - 3 * 18px - 2 * var(--gutter)) / 3.4);
    gap: 18px;
    padding: 0 var(--gutter) 6px;
    scroll-padding: 0 var(--gutter);
  }

  .story__card {
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    padding: 14px 14px 26px;
    border-radius: var(--r-lg);
    background: var(--ahti-paper);
    border: 1px solid var(--ahti-line);
  }

  .story__card .story__art {
    margin-bottom: 22px;
  }

  .story__card .story__n {
    display: block;
    font: 600 11px/1 var(--ahti-sans);
    letter-spacing: 0.16em;
    color: var(--ahti-ink-3);
    padding: 0 8px;
  }

  .story__card .story__t {
    font: 400 clamp(23px, 1.8vw, 28px) / 1.12 var(--ahti-display);
    letter-spacing: -0.015em;
    margin: 10px 0;
    padding: 0 8px;
  }

  .story__card p {
    font: 400 15.5px/1.6 var(--ahti-sans);
    color: var(--ahti-ink-2);
    padding: 0 8px;
  }

  .story--chapters {
    background: var(--ahti-paper);
    border: 0;
  }

  .story--chapters .story__head {
    margin-bottom: clamp(48px, 6vw, 96px);
  }

  .story--chapters .story__head .h2 {
    max-width: 18ch;
  }

  .story__steps {
    position: relative;
    display: grid;
    gap: clamp(56px, 8vw, 120px);
  }

  .story__steps::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(var(--ahti-ice), var(--ahti-ice)) center / 1px 100% no-repeat;
    opacity: 0.6;
  }

  .story__step {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(48px, 9vw, 150px);
    align-items: center;
  }

  .story__step .story__art {
    position: relative;
    z-index: 1;
    border-radius: var(--r-xl);
    border: 1px solid var(--ahti-line);
  }

  .story__step:nth-child(2n) .story__art {
    order: 2;
  }

  .story__step .story__n {
    display: block;
    font: 330 clamp(48px, 5vw, 76px) / 1 var(--ahti-display);
    letter-spacing: -0.03em;
    color: var(--ahti-ice);
  }

  .story__step .story__t {
    font: 400 clamp(30px, 3vw, 46px) / 1.04 var(--ahti-display);
    letter-spacing: -0.02em;
    margin: 16px 0;
  }

  .story__step p {
    font: 400 17px/1.6 var(--ahti-sans);
    color: var(--ahti-ink-2);
    max-width: 44ch;
  }

  @media (max-width: 989px) {
    .story__rail {
      grid-auto-columns: min(76vw, 340px);
    }

    .story__steps::before {
      display: none;
    }

    .story__step {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .story__step:nth-child(2n) .story__art {
      order: 0;
    }
  }

  @media (max-width: 749px) {
    .story__head :global(.arrows) {
      display: none;
    }
  }
</style>
