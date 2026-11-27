<script lang="ts">
  import {railEnds, stepRail} from '$lib/utils/rail'
  import Arrow from './Arrow.svelte'

  let {rail, label}: {rail: HTMLElement | undefined; label: string} = $props()

  let ends = $state({atStart: true, atEnd: false})

  $effect(() => {
    if (!rail) return
    const update = () => (ends = railEnds(rail))
    update()
    rail.addEventListener('scroll', update, {passive: true})
    window.addEventListener('resize', update)
    return () => {
      rail.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  })
</script>

<div class="arrows">
  <button
    class="round"
    type="button"
    aria-label="Previous: {label}"
    disabled={ends.atStart}
    onclick={() => stepRail(rail, -1)}><Arrow direction="left" /></button
  >
  <button
    class="round"
    type="button"
    aria-label="Next: {label}"
    disabled={ends.atEnd}
    onclick={() => stepRail(rail, 1)}><Arrow /></button
  >
</div>

<style>
  .arrows {
    display: flex;
    gap: 8px;
  }
</style>
