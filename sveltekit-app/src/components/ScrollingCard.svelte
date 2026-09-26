<script lang="ts">
  import {urlFor} from '$lib/sanity/image'
  import type {Post} from '$lib/sanity/queries'

  export let post: Post
</script>


{#if post}
    <div class="scrolling-card">
        <div class="scrolling-card__container">
            {#if post.mainImage}
                <img
                class="card__cover"
                src={urlFor(post.mainImage).url()}
                alt="Cover image for {post.title}"
                />
            {/if}
            <h3 class="scrolling-card__title">{post.title}</h3>
            {#if post.excerpt}
                <p class="scrolling-card__excerpt">{post.excerpt}</p>
            {/if}
        </div>
    </div>
{/if}
