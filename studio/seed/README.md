# Seed content

`home.ndjson` holds the demo content: three products, the home page, two content pages and the
site settings. Its images point at assets already uploaded to the original project's `production`
dataset, so it is meant for re-importing into that dataset rather than for a new project.

    npx sanity dataset import seed/home.ndjson production --missing

`--missing` skips any document that already exists, so running it again never overwrites edits.

`placeholders/` holds the drawn stand-in images: the page scenes and the product backdrops.
