<script lang="ts">
  import type {SiteSettings} from '$lib/sanity/types'
  import {hrefOf} from '$lib/utils/links'
  import Arrow from './Arrow.svelte'

  let {settings}: {settings: SiteSettings | null | undefined} = $props()

  const KEY = 'ahti-offer-dismissed'
  let dismissed = $state(false)

  function wasDismissed() {
    try {
      return sessionStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  }

  function rememberDismissal() {
    try {
      sessionStorage.setItem(KEY, '1')
      return true
    } catch {
      return false
    }
  }

  $effect(() => {
    dismissed = wasDismissed()
  })

  function dismiss() {
    dismissed = true
    rememberDismissal()
  }
</script>

{#if settings?.offerEnabled && settings.offer?.label && !dismissed}
  <aside class="offer" data-section="offer" aria-label="Offer">
    <a class="offer__link" href={hrefOf(settings.offer.href)}>
      <span class="offer__mark" aria-hidden="true">{settings.siteName?.charAt(0)}</span>
      <span>{settings.offer.label}</span>
    </a>
    <button class="offer__close" type="button" aria-label="Dismiss offer" onclick={dismiss}>
      <Arrow direction="close" />
    </button>
  </aside>
{/if}

<style>
  .offer {
    position: fixed;
    left: 24px;
    bottom: 24px;
    z-index: 60;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 8px 8px 14px;
    border-radius: 999px;
    background: #fff;
    box-shadow:
      0 18px 40px -18px rgba(18, 19, 21, 0.45),
      0 0 0 1px var(--ahti-line);
    animation: rise 0.7s 0.6s var(--ease) both;
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
  }

  .offer__link {
    display: flex;
    align-items: center;
    gap: 12px;
    font: 500 15px/1 var(--ahti-sans);
    color: var(--ahti-ink);
  }

  .offer__mark {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--ahti-ink);
    color: #fff;
    font: 500 15px/1 var(--ahti-display);
  }

  .offer__close {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: var(--ahti-mist);
    color: var(--ahti-ink);
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .offer__close:hover {
    background: #e3e6e6;
  }

  .offer__close :global(svg) {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
  }

  @media (max-width: 749px) {
    .offer {
      left: 12px;
      bottom: 12px;
    }
  }
</style>
