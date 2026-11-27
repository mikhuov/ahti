const base = process.env.SMOKE_URL ?? 'http://localhost:5173'
const sections = [
  'heroSection',
  'marqueeSection',
  'introSection',
  'rangeSection',
  'storySection',
  'socialSection',
  'cardsSection',
]
const failures = []

async function page(path) {
  const res = await fetch(base + path)
  return {status: res.status, html: await res.text()}
}

function expect(ok, message) {
  if (!ok) failures.push(message)
}

const marker = (name) => `data-section="${name}"`

const home = await page('/')
expect(home.status === 200, `home: status ${home.status}`)
for (const name of ['announcement', 'header', 'footer', 'offer']) {
  expect(home.html.includes(marker(name)), `home: missing ${name}`)
}
let last = -1
for (const name of sections) {
  const at = home.html.indexOf(marker(name))
  expect(at !== -1, `home: missing ${name}`)
  expect(at === -1 || at > last, `home: ${name} is out of order`)
  if (at !== -1) last = at
}
const productLinks = [...home.html.matchAll(/href="(\/products\/[^"#?]+)"/g)].map((m) => m[1])
expect(productLinks.length > 0, 'home: no links to product pages')

const empty = await page('/?smoke=empty')
expect(empty.status === 200, `empty home: status ${empty.status}`)
expect(empty.html.includes(marker('header')), 'empty home: missing header')
expect(empty.html.includes(marker('footer')), 'empty home: missing footer')
expect(!sections.some((s) => empty.html.includes(marker(s))), 'empty home: rendered a section')

for (const path of new Set(productLinks)) {
  const product = await page(path)
  expect(product.status === 200, `${path}: status ${product.status}`)
  expect(product.html.includes(marker('product')), `${path}: missing product panel`)
  expect(product.html.includes(marker('footer')), `${path}: missing footer`)
}

const pageLinks = [...home.html.matchAll(/href="(\/pages\/[^"#?]+)"/g)].map((m) => m[1])
expect(pageLinks.length > 0, 'home: no links to content pages')
for (const path of new Set(pageLinks)) {
  const content = await page(path)
  expect(content.status === 200, `${path}: status ${content.status}`)
  expect(content.html.includes(marker('pageHeroSection')), `${path}: missing page hero`)
  expect(content.html.includes(marker('footer')), `${path}: missing footer`)
}
const noPage = await page('/pages/does-not-exist')
expect(noPage.status === 404, `unknown page: status ${noPage.status}, expected 404`)

const missing = await page('/products/does-not-exist')
expect(missing.status === 404, `unknown product: status ${missing.status}, expected 404`)

if (failures.length) {
  console.error(`FAIL (${failures.length})\n- ` + failures.join('\n- '))
  process.exit(1)
}
console.log(`PASS: home (${sections.length} sections), empty home, ${new Set(productLinks).size} product pages, ${new Set(pageLinks).size} content pages, 404s`)
