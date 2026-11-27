<script lang="ts">
  import type {Component} from 'svelte'
  import type {Section} from '$lib/sanity/types'
  import {clean} from '$lib/utils/links'
  import Cards from './sections/Cards.svelte'
  import Hero from './sections/Hero.svelte'
  import Intro from './sections/Intro.svelte'
  import Marquee from './sections/Marquee.svelte'
  import PageHero from './sections/PageHero.svelte'
  import Range from './sections/Range.svelte'
  import Social from './sections/Social.svelte'
  import Split from './sections/Split.svelte'
  import Story from './sections/Story.svelte'

  let {sections}: {sections?: Section[] | null} = $props()

  const components: Record<string, Component<never>> = {
    heroSection: Hero,
    pageHeroSection: PageHero,
    splitSection: Split,
    marqueeSection: Marquee,
    introSection: Intro,
    rangeSection: Range,
    storySection: Story,
    socialSection: Social,
    cardsSection: Cards,
  }

  function blockFor(type: string) {
    return components[clean(type)] as Component<{section: Section}> | undefined
  }
</script>

{#each sections ?? [] as section (section._key)}
  {@const Block = blockFor(section._type)}
  {#if Block}
    <Block {section} />
  {/if}
{/each}
