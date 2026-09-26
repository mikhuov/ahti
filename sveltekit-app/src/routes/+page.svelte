<script lang="ts">
  import {useQuery} from '@sanity/sveltekit'
  import Card from '../components/Card.svelte'
  import Welcome from '../components/Welcome.svelte'
  import type {PageProps} from './$types'

  const {data}: PageProps = $props()
  const query = $derived(useQuery(data))
  const posts = $derived($query.data)
</script>

<header>
  <div class="header">
    <span>Subscribe & Save</span>
    |
    <span>Free Shipping When Buying with 50€</span>
  </div>

  <div class="toolbar">
    <span>Free Returns</span>
    |
    <span>Secure Payment</span>
  </div>
</header>


  {#if posts?.length}
    {#each posts as post}
      <Card {post} />
    {/each}
  {:else}
    <Welcome />
  {/if} 

<style>
  header {
    width: 100%;
  }

  .header,
  .toolbar {
    width: 100%;
    box-sizing: border-box;

    display: flex;
    justify-content: center;
    align-items: center;

    gap: 1rem;

    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.03em;

    height: 36px;
  }

  .header {
    background-color: #000000;
    color: #ffffff;
  }

  .toolbar {
    background-color: #ffffff;
    color: #000000;
  }
</style>