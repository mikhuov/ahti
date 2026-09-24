import { createClient } from '@sanity/client';
import { env } from '$env/dynamic/public';

export const isSanityConfigured =
	!!env.PUBLIC_SANITY_PROJECT_ID && env.PUBLIC_SANITY_PROJECT_ID !== 'your-project-id';

export const client = createClient({
	projectId: env.PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
	dataset: env.PUBLIC_SANITY_DATASET || 'production',
	apiVersion: '2026-09-24',
	useCdn: true
});
