import { client, isSanityConfigured } from '$lib/server/sanity';
import type { PageServerLoad } from './$types';

type Post = {
	_id: string;
	title: string;
	slug: string;
	publishedAt?: string;
};

export const load: PageServerLoad = async () => {
	if (!isSanityConfigured) {
		return { posts: [] as Post[], configured: false };
	}

	const posts = await client.fetch<Post[]>(
		`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
			_id, title, "slug": slug.current, publishedAt
		}`
	);

	return { posts, configured: true };
};
