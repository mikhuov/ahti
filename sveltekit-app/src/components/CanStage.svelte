<script lang="ts">
  import {imageSrc} from '$lib/sanity/image'
  import type {ProductCard} from '$lib/sanity/types'
  import {clean} from '$lib/utils/links'
  import CanArt from './CanArt.svelte'

  let {product, eager = false}: {product: ProductCard; eager?: boolean} = $props()

  const tone = $derived(clean(product.tone) ?? 'still')
  const photo = $derived(imageSrc(product.image, 1000, 1000))
  const backdrop = $derived(imageSrc(product.backdrop, 1000, 1000))
  const onWater = $derived(tone === 'still')
  const loading = $derived(eager ? 'eager' : 'lazy')

  let lifted = $state(false)
  let splashes = $state(0)

  type Bubble = {
    x0: number
    y0: number
    x1: number
    y1: number
    size: number
    delay: number
    duration: number
    opacity: number
  }
  let bubbles = $state<Bubble[]>([])
  let wakes = $state(0)

  function swimBy() {
    const count = 70
    bubbles = Array.from({length: count}, (_, i) => {
      const t = Math.min(1, Math.max(0, i / (count - 1) + (Math.random() - 0.5) * 0.06))
      const x0 = 50 + (Math.random() - 0.5) * 64
      const y0 = 96 - 86 * t
      return {
        x0,
        y0,
        x1: x0 + (Math.random() - 0.5) * 4,
        y1: y0 - 8 - Math.random() * 14,
        size: 0.6 + Math.random() ** 2 * 2.2,
        delay: t * 0.7 + Math.random() * 0.12,
        duration: 2.6 + Math.random() * 1.4,
        opacity: 0.5 + Math.random() * 0.4,
      }
    })
    wakes += 1
  }

  function lift(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return
    lifted = true
    if (tone === 'sparkling') swimBy()
  }

  function drop(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || !lifted) return
    lifted = false
    if (onWater) splashes += 1
  }
</script>

<div
  class="stage stage--{tone}"
  class:is-lifted={lifted}
  class:has-backdrop={Boolean(backdrop)}
  onpointerenter={lift}
  onpointerleave={drop}
  role="presentation"
>
  {#if photo}
    <img class="stage__fill" src={photo} alt={clean(product.name) ?? ''} {loading} />
  {:else}
    {#if backdrop}<img class="stage__fill" src={backdrop} alt="" {loading} />{/if}

    {#if onWater}
      <div class="stage__reflect" aria-hidden="true">
        <CanArt name={product.name} tone={product.tone} italic={product.italicName} />
      </div>
      {#key splashes}
        {#if splashes}
          <div class="stage__splash" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        {/if}
      {/key}
    {:else if !backdrop}
      <div class="stage__floor"></div>
    {/if}

    {#if tone === 'vadelma'}<div class="stage__glow" aria-hidden="true"></div>{/if}

    <div class="stage__can">
      <CanArt name={product.name} tone={product.tone} italic={product.italicName} />
    </div>

    {#if tone === 'sparkling'}
      {#key wakes}
        {#if wakes}
          <div class="stage__bubbles" aria-hidden="true">
            {#each bubbles as b, i (i)}
              <span
                style:--x0="{b.x0}cqw"
                style:--y0="{b.y0}cqh"
                style:--x1="{b.x1}cqw"
                style:--y1="{b.y1}cqh"
                style:--size="{b.size}cqw"
                style:--peak={b.opacity}
                style:animation-delay="{b.delay}s"
                style:animation-duration="{b.duration}s"
              ></span>
            {/each}
          </div>
        {/if}
      {/key}
    {/if}
  {/if}
</div>

<style>
  .stage {
    --water: 89%;
    --lift: -4%;
    position: relative;
    aspect-ratio: 1 / 1;
    width: 100%;
    overflow: hidden;
    border-radius: var(--r-lg);
    background: var(--ahti-mist);
    isolation: isolate;
  }

  .stage__fill {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .stage--still {
    background: linear-gradient(180deg, #eef1f3 0 34%, #d9e0e4 34%, #66727c 75%, #2f3740);
  }

  .stage--sparkling {
    background: radial-gradient(75% 65% at 50% 34%, #eef4f8, #c9d9e4 46%, #8fa9bc);
  }

  .stage--vadelma {
    background:
      radial-gradient(40% 30% at 12% 20%, #f1c9d2aa, #f1c9d200),
      radial-gradient(36% 28% at 90% 70%, #efc2ccaa, #efc2cc00),
      linear-gradient(180deg, #edf1f4, #f6e6ea 60%, #e6ecf0);
  }

  .stage__floor {
    position: absolute;
    left: 50%;
    bottom: 7%;
    width: 46%;
    aspect-ratio: 6 / 1;
    transform: translateX(-50%);
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba(18, 19, 21, 0.22), rgba(18, 19, 21, 0));
  }

  .stage__can {
    position: absolute;
    left: 50%;
    bottom: calc(100% - var(--water));
    height: 76%;
    transform: translate3d(-50%, 0, 0);
    transition: transform 0.42s cubic-bezier(0.55, 0, 0.9, 0.4);
  }

  .is-lifted .stage__can {
    transform: translate3d(-50%, var(--lift), 0);
    transition: transform 0.9s var(--ease);
  }

  .stage__reflect {
    position: absolute;
    left: 50%;
    top: var(--water);
    height: 76%;
    transform: translate3d(-50%, 0, 0) scaleY(-1);
    opacity: 0.3;
    filter: blur(1.5px);
    -webkit-mask-image: linear-gradient(to top, #000, transparent 55%);
    mask-image: linear-gradient(to top, #000, transparent 55%);
    transition: transform 0.42s cubic-bezier(0.55, 0, 0.9, 0.4);
  }

  .is-lifted .stage__reflect {
    transform: translate3d(-50%, calc(-1 * var(--lift)), 0) scaleY(-1);
    transition: transform 0.9s var(--ease);
  }

  .stage__glow {
    position: absolute;
    left: 50%;
    top: 51%;
    width: 86%;
    height: 94%;
    border-radius: 50%;
    background: radial-gradient(
      closest-side,
      rgba(222, 88, 118, 0.36),
      rgba(236, 150, 172, 0.2) 55%,
      rgba(240, 170, 186, 0)
    );
    filter: blur(14px);
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
    transition:
      opacity 0.9s ease,
      transform 1.2s var(--ease);
  }

  .is-lifted .stage__glow {
    opacity: 1;
    transform: translate(-50%, -53%) scale(1);
  }

  .stage__bubbles {
    position: absolute;
    inset: 0;
    container-type: size;
    pointer-events: none;
  }

  .stage__bubbles span {
    position: absolute;
    left: 0;
    top: 0;
    width: var(--size);
    height: var(--size);
    margin: calc(var(--size) / -2) 0 0 calc(var(--size) / -2);
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.65);
    background: radial-gradient(
      circle at 35% 30%,
      rgba(255, 255, 255, 0.75),
      rgba(255, 255, 255, 0.1) 45%,
      rgba(255, 255, 255, 0.03) 70%
    );
    opacity: 0;
    animation: swim 1.4s cubic-bezier(0.2, 0.7, 0.3, 1) both;
  }

  @keyframes swim {
    0% {
      opacity: 0;
      transform: translate(var(--x0), var(--y0)) scale(0.3);
    }

    12% {
      opacity: var(--peak);
    }

    100% {
      opacity: 0;
      transform: translate(var(--x1), var(--y1)) scale(1);
    }
  }

  .stage__splash {
    position: absolute;
    left: 50%;
    top: var(--water);
    aspect-ratio: 5 / 1;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .stage__splash {
    width: 40%;
  }

  .stage__splash span {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.5);
    opacity: 0;
    animation: ripple 2.6s cubic-bezier(0.25, 0.6, 0.3, 1) 0.38s forwards;
  }

  .stage__splash span:nth-child(2) {
    animation-delay: 0.62s;
  }

  .stage__splash span:nth-child(3) {
    animation-delay: 0.86s;
  }

  @keyframes ripple {
    0% {
      opacity: 0;
      transform: scale(0.4);
    }

    15% {
      opacity: 0.6;
    }

    100% {
      opacity: 0;
      transform: scale(1.8);
    }
  }
</style>
