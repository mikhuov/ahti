<script lang="ts">
  import {beforeNavigate} from '$app/navigation'
  import {page} from '$app/state'
  import {cart} from '$lib/cart.svelte'
  import {imageSrc} from '$lib/sanity/image'
  import type {SiteSettings} from '$lib/sanity/types'
  import {clean, homeHref, hrefOf, productHref} from '$lib/utils/links'
  import {formatPrice} from '$lib/utils/price'
  import CanArt from './CanArt.svelte'

  let {settings}: {settings: SiteSettings | null | undefined} = $props()

  let scrolled = $state(false)
  let megaOpen = $state(false)
  let menuOpen = $state(false)

  const home = $derived(page.url.pathname === '/')
  const solid = $derived(!home || scrolled || megaOpen)
  const logo = $derived(imageSrc(settings?.logo, 320))
  const products = $derived(settings?.products ?? [])

  function closeAll() {
    megaOpen = false
    menuOpen = false
  }

  beforeNavigate(closeAll)

  $effect(() => {
    scrolled = window.scrollY > 40
  })

  $effect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  })
</script>

<svelte:window
  onscroll={() => (scrolled = window.scrollY > 40)}
  onkeydown={(e) => e.key === 'Escape' && closeAll()}
/>

<div class="sticky">
  <header class="hdr" class:is-solid={solid} data-section="header">
    <div class="hdr__bar">
      <nav class="hdr__nav" aria-label="Main">
        {#if settings?.shopLabel}
          <button
            class="hdr__shop"
            type="button"
            aria-expanded={megaOpen}
            aria-controls="shop-menu"
            onclick={() => (megaOpen = !megaOpen)}
          >
            {settings.shopLabel}
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5L6 8l3.5-3.5" /></svg>
          </button>
        {/if}
        {#each settings?.navLeft ?? [] as link (link._key)}
          <a href={hrefOf(link.href)}>{link.label}</a>
        {/each}
      </nav>

      <a class="hdr__brand" href={homeHref()} aria-label={clean(settings?.siteName)}>
        {#if logo}
          <img src={logo} alt={clean(settings?.siteName) ?? ''} />
        {:else}
          <span>{settings?.siteName}</span>
        {/if}
      </a>

      <div class="hdr__right">
        {#each settings?.navRight ?? [] as link (link._key)}
          <a class="hdr__link" href={hrefOf(link.href)}>{link.label}</a>
        {/each}
        <a class="hdr__cart" href="#cart" aria-label="Cart, {cart.count} items">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5.5 8.5h13l1 12h-15l1-12z" /><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
          </svg>
          {#if cart.count > 0}<span class="hdr__count">{cart.count}</span>{/if}
        </a>
        <button
          class="hdr__burger"
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onclick={() => (menuOpen = true)}
        >
          <span></span><span></span>
        </button>
      </div>
    </div>

    {#if megaOpen}
      <div class="mega" id="shop-menu">
        <div class="mega__in">
          <ul class="mega__cans">
            {#each products as product (product._id)}
              <li class="mega__can mega__can--{clean(product.tone)}">
                <a href={productHref(product.slug)}>
                  <span class="mega__img">
                    <CanArt name={product.name} tone={product.tone} italic={product.italicName} />
                  </span>
                  <span class="mega__t" class:is-italic={product.italicName}>{product.name}</span>
                  <span class="mega__d">{product.tagline}</span>
                  {#if formatPrice(product.fromPrice)}
                    <span class="mega__p">
                      {settings?.priceFromLabel}
                      {formatPrice(product.fromPrice)}
                    </span>
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
          <div class="mega__side">
            {#if settings?.shopMenuTitle}<p class="eyebrow">{settings.shopMenuTitle}</p>{/if}
            {#each settings?.shopMenuLinks ?? [] as link (link._key)}
              <a href={hrefOf(link.href)}>{link.label}</a>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </header>
  {#if megaOpen}
    <button class="scrim" type="button" aria-label="Close shop menu" onclick={closeAll}></button>
  {/if}
</div>

{#if menuOpen}
  <div class="mob" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="mob__top">
      <span class="mob__label">{settings?.menuLabel}</span>
      <button class="mob__close" type="button" aria-label="Close menu" onclick={closeAll}>
        <span></span><span></span>
      </button>
    </div>
    <div class="mob__cans">
      {#each products as product (product._id)}
        <a class="mob__can" href={productHref(product.slug)}>
          <span class="mob__img">
            <CanArt name={product.name} tone={product.tone} italic={product.italicName} />
          </span>
          <span class:is-italic={product.italicName}>{product.name}</span>
        </a>
      {/each}
    </div>
    <nav class="mob__nav" aria-label="Mobile">
      {#each [...(settings?.navLeft ?? []), ...(settings?.navRight ?? [])] as link (link._key)}
        <a href={hrefOf(link.href)}>{link.label}</a>
      {/each}
    </nav>
    <div class="mob__sub">
      {#each settings?.shopMenuLinks ?? [] as link (link._key)}
        <a href={hrefOf(link.href)}>{link.label}</a>
      {/each}
    </div>
  </div>
{/if}

<style>
  .sticky {
    position: sticky;
    top: 0;
    z-index: 70;
    view-transition-name: site-header;
  }

  .hdr {
    position: relative;
    z-index: 2;
    height: var(--hdr-height);
    color: var(--ahti-ink);
    transition:
      background-color 0.5s ease,
      box-shadow 0.5s ease;
  }

  .hdr.is-solid {
    background: #fbfaf7db;
    -webkit-backdrop-filter: blur(18px) saturate(1.4);
    backdrop-filter: blur(18px) saturate(1.4);
    box-shadow: 0 1px 0 var(--ahti-line);
  }

  .hdr__bar {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 24px;
    padding: 0 var(--gutter);
    max-width: 1680px;
    margin: 0 auto;
  }

  .hdr__nav {
    display: flex;
    align-items: center;
    gap: clamp(18px, 2vw, 34px);
  }

  .hdr__nav a,
  .hdr__shop,
  .hdr__link {
    font: 500 15px/1 var(--ahti-sans);
    color: inherit;
    letter-spacing: 0.005em;
    position: relative;
    padding: 8px 0;
    background: none;
    border: 0;
    cursor: pointer;
  }

  .hdr__nav a::after,
  .hdr__link::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2px;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform 0.45s var(--ease);
  }

  .hdr__nav a:hover::after,
  .hdr__link:hover::after {
    transform: scaleX(1);
  }

  .hdr__shop {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    margin-left: -16px;
    border-radius: 999px;
    transition: background-color 0.3s;
  }

  .hdr__shop svg {
    width: 12px;
    height: 12px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    transition: transform 0.4s var(--ease);
  }

  .hdr__shop:hover,
  .hdr__shop[aria-expanded='true'] {
    background: #12131512;
  }

  .hdr__shop[aria-expanded='true'] svg {
    transform: rotate(180deg);
  }

  .hdr__brand {
    display: flex;
    align-items: center;
    justify-self: center;
    font: 500 24px/1 var(--ahti-display);
    letter-spacing: 0.08em;
  }

  .hdr__brand img {
    height: 26px;
    width: auto;
  }

  .hdr__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: clamp(14px, 1.6vw, 26px);
  }

  .hdr__cart {
    position: relative;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    transition: background-color 0.3s;
  }

  .hdr__cart:hover {
    background: #12131512;
  }

  .hdr__cart svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linejoin: round;
  }

  .hdr__count {
    position: absolute;
    top: 4px;
    right: 2px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--ahti-ink);
    color: #fff;
    font: 600 10.5px/18px var(--ahti-sans);
    text-align: center;
  }

  .hdr__burger,
  .mob__close {
    display: none;
    width: 44px;
    height: 44px;
    padding: 0;
    border-radius: 50%;
    border: 1px solid rgba(18, 19, 21, 0.16);
    background: #ffffffb3;
    cursor: pointer;
    position: relative;
  }

  .hdr__burger span,
  .mob__close span {
    position: absolute;
    left: 13px;
    right: 13px;
    height: 1.5px;
    background: var(--ahti-ink);
    border-radius: 2px;
  }

  .hdr__burger span:first-child {
    top: 17px;
  }

  .hdr__burger span:last-child {
    top: 25px;
  }

  .mob__close span {
    top: 21px;
  }

  .mob__close span:first-child {
    transform: rotate(45deg);
  }

  .mob__close span:last-child {
    transform: rotate(-45deg);
  }

  .mega {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    padding: 0 var(--gutter);
  }

  .mega__in {
    max-width: 1240px;
    margin: 10px auto 0;
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 24px;
    padding: 22px;
    background: #fff;
    border-radius: var(--r-lg);
    box-shadow:
      0 30px 80px -30px #12131559,
      0 0 0 1px var(--ahti-line);
    animation: drop 0.5s var(--ease) both;
  }

  @keyframes drop {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
  }

  .mega__cans {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  .mega__can a {
    display: grid;
    gap: 4px;
    padding: 0 0 18px;
    border-radius: var(--r-md);
    background: var(--ahti-mist);
    overflow: hidden;
    height: 100%;
  }

  .mega__img {
    height: 230px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 22px 0 14px;
    margin-bottom: 6px;
    transition: transform 0.7s var(--ease);
  }

  .mega__can--vadelma .mega__img {
    background: radial-gradient(60% 70% at 50% 80%, #f6dfe4, #f6dfe400);
  }

  .mega__can--still .mega__img {
    background: radial-gradient(60% 70% at 50% 80%, #e2edf3, #e2edf300);
  }

  .mega__can--sparkling .mega__img {
    background: radial-gradient(60% 70% at 50% 80%, #dbe6ef, #dbe6ef00);
  }

  .mega__can a:hover .mega__img {
    transform: translateY(-5px) rotate(-2deg);
  }

  .mega__t {
    padding: 0 20px;
    font: 400 26px/1.1 var(--ahti-display);
    letter-spacing: -0.02em;
  }

  .is-italic {
    font-style: italic;
  }

  .mega__d,
  .mega__p {
    padding: 0 20px;
    font: 400 13.5px/1.4 var(--ahti-sans);
    color: var(--ahti-ink-2);
  }

  .mega__p {
    color: var(--ahti-ink);
    font-weight: 600;
  }

  .mega__side {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 6px;
  }

  .mega__side .eyebrow {
    margin-bottom: 10px;
  }

  .mega__side a {
    font: 400 20px/1.25 var(--ahti-display);
    padding: 6px 0;
    letter-spacing: -0.01em;
    transition: transform 0.4s var(--ease);
  }

  .mega__side a:hover {
    transform: translate(4px);
  }

  .scrim {
    position: fixed;
    inset: 0;
    z-index: 1;
    border: 0;
    padding: 0;
    background: rgba(18, 19, 21, 0.12);
    cursor: default;
  }

  .mob {
    position: fixed;
    inset: 0;
    z-index: 90;
    background: var(--ahti-paper);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0 var(--gutter) 40px;
    color: var(--ahti-ink);
    animation: drop 0.45s var(--ease) both;
  }

  .mob__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--hdr-height);
  }

  .mob__label {
    font: 600 11.5px/1 var(--ahti-sans);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ahti-ink-2);
  }

  .mob__close {
    display: block;
  }

  .mob__cans {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 6px 0 26px;
  }

  .mob__can {
    display: grid;
    justify-items: center;
    gap: 10px;
    padding: 18px 6px 14px;
    border-radius: var(--r-md);
    background: var(--ahti-mist);
    font: 400 17px/1 var(--ahti-display);
  }

  .mob__img {
    height: 128px;
  }

  .mob__nav {
    display: grid;
    border-top: 1px solid var(--ahti-line);
  }

  .mob__nav a {
    font: 350 clamp(32px, 9vw, 44px) / 1.1 var(--ahti-display);
    letter-spacing: -0.02em;
    padding: 14px 0;
    border-bottom: 1px solid var(--ahti-line);
  }

  .mob__sub {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 24px;
  }

  .mob__sub a {
    font: 500 14px/1 var(--ahti-sans);
    padding: 12px 16px;
    border-radius: 999px;
    border: 1px solid rgba(18, 19, 21, 0.16);
  }

  @media (max-width: 989px) {
    .hdr__bar {
      grid-template-columns: 1fr auto;
    }

    .hdr__nav,
    .hdr__link,
    .mega,
    .scrim {
      display: none;
    }

    .hdr__brand {
      justify-self: start;
    }

    .hdr__burger {
      display: block;
    }
  }
</style>
