<script lang="ts">
  import {urlFor} from '$lib/sanity/image'
  import type {Post} from '$lib/sanity/queries'
  import { PortableText } from '@portabletext/svelte'

  export let post: Post
</script>

<!--  href={`/post/${post.slug.current}`} -->
<div class="card">
  {#if post.mainImage}
    <img
      class="card__cover"
      src={urlFor(post.mainImage).url()}
      alt="Cover image for {post.title}"
    />
  {:else}
    <div class="card__cover--none"></div>
  {/if}

  <div class="card__container">
    <h3 class="card__title">
      {post.title}
    </h3>
    {#if post.excerpt}
      <p class="card__excerpt">{post.excerpt}</p>
    {/if}
    {#if post.body}
      <div class="card__content">
        <PortableText components={{}} value={post.body} />
      </div>
    {/if}
  </div>
</div>

<style>
  .card {
    display: flex;
    align-items: center;
    align-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .card__container {
    color: #ffffff;
    background-color: #000000;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card__excerpt {
    font-size: clamp(28px, 5vw, 64px);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    text-transform: none;
    margin: 0;
  }

  .card__content {
    font-size: clamp(13px, 1.4vw, 16px);
    font-weight: 400;
    line-height: 1.75;
  }

  img {
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
  }
</style>
