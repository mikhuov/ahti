# ahti

SvelteKit frontend + Sanity CMS, managed as an npm workspaces monorepo.

| Folder    | What                                 | Dev URL               |
| --------- | ------------------------------------ | --------------------- |
| `web/`    | SvelteKit app (TypeScript)           | http://localhost:5173 |
| `studio/` | Sanity Studio (content editing UI)   | http://localhost:3333 |

## Requirements

- Node.js >= 22.12

## Setup

1. Install dependencies (from the repo root):

   ```sh
   npm install
   ```

2. Create a Sanity project at <https://www.sanity.io/manage> (or run `npx sanity login` and
   `npx sanity init` in `studio/`) and note its **project ID**.

3. Create env files from the examples and fill in the project ID:

   ```sh
   cp studio/.env.example studio/.env
   cp web/.env.example web/.env
   ```

4. In the Sanity project settings, under **API → CORS origins**, add `http://localhost:5173`.

## Scripts (run from repo root)

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `npm run dev`        | Run web and studio together     |
| `npm run dev:web`    | Run only the SvelteKit app      |
| `npm run dev:studio` | Run only Sanity Studio          |
| `npm run build`      | Build both                      |
| `npm run lint`       | Lint (web)                      |

See [docs/seltzer-brand-roadmap.md](docs/seltzer-brand-roadmap.md) for the plan to build out the brand site.
