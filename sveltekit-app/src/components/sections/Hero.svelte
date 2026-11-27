<script lang="ts">
  import {imageSrc} from '$lib/sanity/image'
  import type {HeroSection} from '$lib/sanity/types'
  import {hrefOf} from '$lib/utils/links'

  let {section}: {section: HeroSection} = $props()

  const src = $derived(imageSrc(section.image, 2400))
</script>

<section class="hero" data-section="heroSection">
  <div class="hero__media">
    {#if src}
      <img {src} alt="" fetchpriority="high" />
    {/if}
  </div>
  <div class="hero__shade"></div>

  <div class="hero__content">
    {#if section.eyebrow}<p class="hero__eyebrow">{section.eyebrow}</p>{/if}
    <h1 class="hero__title">
      {#each section.titleLines ?? [] as line, i (i)}
        <span class="hero__line"><span style:animation-delay="{i * 0.14}s">{line}</span></span>
      {/each}
    </h1>
  </div>

  <div class="hero__aside">
    {#if section.aside}<p class="hero__lede">{section.aside}</p>{/if}
    {#if section.button?.label}
      <a class="hero__btn" href={hrefOf(section.button.href)}>{section.button.label}</a>
    {/if}
  </div>
</section>

<style>
  .hero {
    position: relative;
    margin-top: calc(-1 * var(--hdr-height));
    height: max(640px, 100svh);
    min-height: 560px;
    overflow: hidden;
    background: #26384a;
    color: #fff;
    isolation: isolate;
  }

  .hero__media,
  .hero__shade {
    position: absolute;
    inset: 0;
  }

  .hero__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero__shade {
    z-index: 1;
    pointer-events: none;
    background:
      linear-gradient(180deg, #f4f7fa42, #f4f7fa00 26%),
      linear-gradient(0deg, #0a162294, #0a162229 28%, #0a162200 46%);
  }

  .hero__content {
    position: absolute;
    z-index: 2;
    left: clamp(20px, 6vw, 104px);
    top: calc(var(--hdr-height) + clamp(40px, 9svh, 110px));
    max-width: 54vw;
    color: #0f1d26;
  }

  .hero__eyebrow {
    font: 300 11px/1.4 var(--ahti-sans);
    letter-spacing: 0.34em;
    text-transform: uppercase;
    margin-bottom: 22px;
  }

  .hero__title {
    font-family: var(--ahti-display);
    font-weight: 400;
    font-optical-sizing: auto;
    letter-spacing: -0.035em;
    font-size: clamp(52px, 5.7vw, 108px);
    line-height: 0.9;
  }

  .hero__line {
    display: block;
    overflow: hidden;
    padding: 0.08em 0.06em 0.26em;
    margin: -0.08em -0.06em -0.26em;
  }

  .hero__line > span {
    display: block;
    animation: rise 1.5s var(--ease) both;
  }

  @keyframes rise {
    from {
      transform: translateY(105%);
    }
  }

  .hero__aside {
    position: absolute;
    z-index: 2;
    right: clamp(20px, 6vw, 104px);
    bottom: clamp(70px, 13svh, 130px);
    max-width: 340px;
    animation: fade 1.4s 0.55s ease both;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
  }

  .hero__lede {
    font: 300 17px/1.6 var(--ahti-sans);
    margin-bottom: 22px;
  }

  .hero__btn {
    display: inline-flex;
    align-items: center;
    min-height: 50px;
    padding: 0 28px;
    border-radius: 999px;
    border: 1px solid #ffffffb3;
    background: #ffffff0f;
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    color: #fff !important;
    font: 500 13px/1 var(--ahti-sans);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    transition:
      background-color 0.4s,
      color 0.4s;
  }

  .hero__btn:hover {
    background: #fff;
    color: #0f1d26 !important;
  }

  @media (max-width: 749px) {
    .hero {
      height: max(620px, 100svh);
    }

    .hero__shade {
      background:
        linear-gradient(180deg, #f4f7fa4d, #f4f7fa00 18%),
        linear-gradient(0deg, #08121cc7, #08121c5c 38%, #08121c00 60%);
    }

    .hero__content {
      top: auto;
      bottom: 214px;
      left: 22px;
      right: 22px;
      max-width: none;
      color: #fff;
    }

    .hero__title {
      font-size: clamp(50px, 14.4vw, 74px);
    }

    .hero__aside {
      left: 22px;
      right: 22px;
      bottom: 44px;
      max-width: none;
    }
  }
</style>
