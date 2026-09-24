<script lang="ts">
	let { data } = $props();
</script>

<h1>ahti</h1>

{#if !data.configured}
	<p>
		Sanity is not configured yet. Copy <code>web/.env.example</code> to <code>web/.env</code> and set
		your project ID.
	</p>
{:else if data.posts.length === 0}
	<p>No posts yet. Create one in the Studio.</p>
{:else}
	<ul>
		{#each data.posts as post (post._id)}
			<li>{post.title}</li>
		{/each}
	</ul>
{/if}
