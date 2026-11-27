<script lang="ts">
  import {getSiteSettings} from '$lib/siteSettings'
  import {imageSrc} from '$lib/sanity/image'
  import type {IntroSection} from '$lib/sanity/types'
  import Button from '../Button.svelte'

  const site = getSiteSettings()

  let {section}: {section: IntroSection} = $props()

  const uid = $props.id()
  const frames = [
    {slot: 'a', w: 800, h: 1080},
    {slot: 'b', w: 700, h: 805},
    {slot: 'c', w: 600, h: 600},
  ]
</script>

<section class="intro" data-section="introSection">
  <div class="wrap intro__grid">
    <div class="intro__copy">
      {#if section.eyebrow}<p class="eyebrow">{section.eyebrow}</p>{/if}
      {#if section.heading}<h2 class="h2">{section.heading}</h2>{/if}
      {#if section.lede}<p class="lede">{section.lede}</p>{/if}
      {#if section.facts?.length}
        <ul class="intro__facts">
          {#each section.facts as fact (fact._key)}
            <li>
              <span class="intro__k">{fact.key}</span>
              <span class="intro__v">{fact.value}</span>
            </li>
          {/each}
        </ul>
      {/if}
      <Button link={section.button} />
    </div>

    <div class="intro__collage">
      {#each frames as frame, i (frame.slot)}
        {@const src = imageSrc(section.images?.[i], frame.w, frame.h)}
        <div class="intro__f intro__f--{frame.slot}">
          {#if src}<img {src} alt="" loading="lazy" />{/if}
        </div>
      {/each}
      {#if section.sealText}
        <div class="intro__seal" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <defs>
              <path id="{uid}-ring" d="M50 50m-40 0a40 40 0 1 1 80 0a40 40 0 1 1-80 0" />
            </defs>
            <text><textPath href="#{uid}-ring">{section.sealText.repeat(2)}</textPath></text>
          </svg>
          <span>{site()?.siteName?.charAt(0)}</span>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .intro {
    padding: clamp(64px, 8vw, 128px) 0 clamp(56px, 7vw, 112px);
  }

  .intro__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: clamp(40px, 6vw, 110px);
    align-items: center;
  }

  .intro__copy .lede {
    margin-top: 22px;
  }

  .intro__facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    margin: 36px 0 34px;
    padding-top: 22px;
    border-top: 1px solid var(--ahti-line);
  }

  .intro__facts li {
    display: grid;
    gap: 6px;
  }

  .intro__k {
    font: 600 11px/1.3 var(--ahti-sans);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ahti-ink-3);
  }

  .intro__v {
    font: 400 20px/1.2 var(--ahti-display);
    letter-spacing: -0.01em;
  }

  .intro__collage {
    position: relative;
    aspect-ratio: 1 / 1.02;
  }

  .intro__f {
    position: absolute;
    border-radius: var(--r-lg);
    overflow: hidden;
    background: var(--ahti-mist);
    box-shadow: 0 30px 60px -40px #12131566;
  }

  .intro__f img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .intro__f--a {
    left: 0;
    top: 8%;
    width: 52%;
    aspect-ratio: 4 / 5.4;
  }

  .intro__f--b {
    right: 0;
    top: 0;
    width: 44%;
    aspect-ratio: 4 / 4.6;
  }

  .intro__f--c {
    right: 8%;
    bottom: 0;
    width: 34%;
    aspect-ratio: 1 / 1;
  }

  .intro__seal {
    position: absolute;
    left: 42%;
    bottom: 6%;
    width: 124px;
    height: 124px;
    border-radius: 50%;
    background: #fff;
    display: grid;
    place-items: center;
    box-shadow: 0 18px 40px -22px #12131573;
    z-index: 2;
  }

  .intro__seal span {
    font: 400 30px/1 var(--ahti-display);
  }

  .intro__seal svg {
    position: absolute;
    inset: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    overflow: visible;
    animation: spin 28s linear infinite;
  }

  .intro__seal text {
    font: 600 9.6px var(--ahti-sans);
    letter-spacing: 0.3em;
    text-transform: uppercase;
    fill: var(--ahti-ink);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 989px) {
    .intro__grid {
      grid-template-columns: 1fr;
    }

    .intro__collage {
      max-width: 560px;
      width: 100%;
      margin: 0 auto;
    }

    .intro__facts {
      gap: 12px;
    }

    .intro__v {
      font-size: 17px;
    }

    .intro__seal {
      width: 100px;
      height: 100px;
      left: 40%;
    }
  }
</style>
