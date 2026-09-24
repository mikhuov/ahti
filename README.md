# ahti

Brand site for a seltzer water brand: a SvelteKit site plus Sanity CMS. Built on Sanity's
official template ([sanity-template-sveltekit-clean](https://github.com/sanity-io/sanity-template-sveltekit-clean)).

| Folder           | What                                | Dev URL               |
| ---------------- | ----------------------------------- | --------------------- |
| `sveltekit-app/` | The website                         | http://localhost:5173 |
| `studio/`        | Sanity Studio, where content is edited | http://localhost:3333 |

## Setup

Needs Node.js 22.

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage). Under **API**, add
   `http://localhost:5173` as a CORS origin (with credentials) and create a **Viewer** token.
2. Copy `studio/.env.example` to `studio/.env` and `sveltekit-app/.env.example` to
   `sveltekit-app/.env`, then fill them in.
3. Run `npm install`, then `npm run dev`.

## Scripts (from the repo root)

| Command                            | Description                     |
| ---------------------------------- | ------------------------------- |
| `npm run dev`                      | Run the site and Studio together |
| `npm run format`                   | Format everything with Prettier |
| `npm run check -w sveltekit-app`   | Type-check the site             |
| `npm run build -w sveltekit-app`   | Build the site                  |
| `npm run deploy -w studio`         | Deploy the Studio               |

See [docs/technical-guide.md](docs/technical-guide.md) for how to build out the brand site.
