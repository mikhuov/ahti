<script lang="ts">
  import type {Tone} from '$lib/sanity/types'
  import {clean} from '$lib/utils/links'

  let {name = '', tone = 'still', italic = false}: {name?: string; tone?: Tone; italic?: boolean} =
    $props()

  const uid = $props.id()
  const t = $derived(clean(tone) ?? 'still')
  const nameSize = $derived(Math.min(13.5, 112 / Math.max((clean(name) ?? '').length, 1)))

  const body =
    'M27 12H93C101 14 109 23 110 36V166C110 177 104 186 95 190H25C16 186 10 177 10 166V36C11 23 19 14 27 12Z'

  const lines: Record<string, string[]> = {
    still: ['Water', 'Naturally Soft'],
    sparkling: ['Water', 'Naturally Soft'],
    vadelma: ['Sparkling Water', '0 sugar'],
  }

  function seeded(text: string) {
    let h = 2166136261
    for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
    return () => {
      h = (h + 0x6d2b79f5) | 0
      let x = Math.imul(h ^ (h >>> 15), 1 | h)
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296
    }
  }

  const onDark = (y: number) =>
    (t === 'sparkling' && (y > 104 || y < 36)) || (t === 'still' && (y < 36 || y > 164))

  const drops = $derived.by(() => {
    const rand = seeded(`${t}:${clean(name) ?? ''}`)
    return Array.from({length: 13 + Math.floor(rand() * 6)}, () => {
      const r = 0.8 + rand() * 1.4
      const x = 17 + rand() * 86
      const y = 40 + Math.sqrt(rand()) * 142
      const len = r > 1.4 && rand() < 0.55 ? 8 + rand() * 18 : 0
      return [x, y, r, len, onDark(y)] as const
    })
  })

  const tear = (x: number, y: number, r: number) =>
    `M${x} ${y - r * 1.6}C${x + r * 0.3} ${y - r * 0.9} ${x + r} ${y - r * 0.3} ${x + r} ${y}` +
    `C${x + r} ${y + r * 0.6} ${x + r * 0.55} ${y + r} ${x} ${y + r}` +
    `C${x - r * 0.55} ${y + r} ${x - r} ${y + r * 0.6} ${x - r} ${y}` +
    `C${x - r} ${y - r * 0.3} ${x - r * 0.3} ${y - r * 0.9} ${x} ${y - r * 1.6}Z`

  const rim = (x: number, y: number, r: number) =>
    `M${x - r * 0.7} ${y + r * 0.3}Q${x} ${y + r * 1.05} ${x + r * 0.7} ${y + r * 0.3}`

  const trail = (x: number, y: number, r: number, len: number) =>
    `M${x - r * 0.4} ${y - r * 0.8}C${x - r * 0.35} ${y - len * 0.5} ${x - r * 0.1} ${y - len * 0.8} ${x} ${y - len}` +
    `C${x + r * 0.1} ${y - len * 0.8} ${x + r * 0.35} ${y - len * 0.5} ${x + r * 0.4} ${y - r * 0.8}Z`
</script>

<svg class="can can--{t}" viewBox="0 0 120 200" role="img" aria-label={clean(name)}>
  <defs>
    <clipPath id="{uid}-clip"><path d={body} /></clipPath>
    <clipPath id="{uid}-low"><rect x="10" y="104" width="100" height="90" /></clipPath>
    <linearGradient id="{uid}-round" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#0b1420" stop-opacity=".42" />
      <stop offset=".07" stop-color="#0b1420" stop-opacity=".14" />
      <stop offset=".2" stop-color="#fff" stop-opacity=".62" />
      <stop offset=".3" stop-color="#fff" stop-opacity=".12" />
      <stop offset=".55" stop-color="#fff" stop-opacity="0" />
      <stop offset=".82" stop-color="#0b1420" stop-opacity=".1" />
      <stop offset=".95" stop-color="#0b1420" stop-opacity=".3" />
      <stop offset="1" stop-color="#0b1420" stop-opacity=".5" />
    </linearGradient>
    <linearGradient id="{uid}-metal" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#7d848c" />
      <stop offset=".22" stop-color="#f4f6f8" />
      <stop offset=".5" stop-color="#b3b9c0" />
      <stop offset=".78" stop-color="#e3e7ea" />
      <stop offset="1" stop-color="#6f767e" />
    </linearGradient>
    <radialGradient id="{uid}-drop" cx=".5" cy=".75" r=".7">
      <stop offset="0" stop-color="#fff" stop-opacity=".4" />
      <stop offset=".6" stop-color="#fff" stop-opacity=".08" />
      <stop offset=".9" stop-color="#0b1420" stop-opacity=".05" />
      <stop offset="1" stop-color="#0b1420" stop-opacity=".12" />
    </radialGradient>
    <linearGradient id="{uid}-trail" x1="0" x2="0" y1="1" y2="0">
      <stop offset="0" stop-color="#0b1420" stop-opacity=".07" />
      <stop offset=".35" stop-color="#fff" stop-opacity=".12" />
      <stop offset="1" stop-color="#fff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="{uid}-trail-dark" x1="0" x2="0" y1="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity=".07" />
      <stop offset="1" stop-color="#fff" stop-opacity="0" />
    </linearGradient>
  </defs>

  <path d="M25 189H95L92 195Q60 199 28 195Z" fill="url(#{uid}-metal)" />
  <path d="M28 195Q60 199 92 195" class="can__edge" />

  <g clip-path="url(#{uid}-clip)">
    <rect x="10" y="10" width="100" height="182" class="can__base" />
    <rect x="10" y="10" width="100" height="26" class="can__band" />
    <rect x="10" y="30" width="100" height="10" class="can__band-soft" />
    <rect x="10" y="164" width="100" height="28" class="can__band" />
    <rect x="10" y="156" width="100" height="10" class="can__band-soft can__band-soft--low" />
    <rect x="10" y="104" width="100" height="90" class="can__lower" />
    {#if t === 'vadelma'}
      {#each [[20, 22], [36, 17], [55, 24], [73, 18], [92, 23], [28, 176], [47, 181], [66, 174], [86, 180], [102, 172]] as [cx, cy] (cx)}
        <circle {cx} {cy} r="4.2" class="can__berry" />
        <circle cx={cx - 1.2} cy={cy - 1.3} r="1.2" fill="#fff" opacity=".35" />
      {/each}
    {/if}

    <rect x="10" y="10" width="100" height="182" fill="url(#{uid}-round)" />

    <text class="can__ink can__brand" transform="translate(38 103) rotate(-90)" text-anchor="middle"
      >AHTI</text
    >
    <line x1="45" y1="50" x2="45" y2="152" class="can__rule" />
    {#if t === 'sparkling'}
      <g clip-path="url(#{uid}-low)" class="can__reverse">
        <text class="can__brand" transform="translate(38 103) rotate(-90)" text-anchor="middle"
          >AHTI</text
        >
        <line x1="45" y1="50" x2="45" y2="152" class="can__rule" />
      </g>
    {/if}
    <text
      class="can__ink can__name"
      class:is-italic={italic}
      x="50"
      y="66"
      style:font-size="{nameSize}px">{name}</text
    >
    {#each lines[t] ?? [] as line, i (line)}
      <text class="can__ink can__small" x="50" y={78 + i * 9}>{line}</text>
    {/each}
    {#each ['Sustainably Canned', 'Finland', '330ml'] as line, i (line)}
      <text class="can__ink can__small can__small--low" x="50" y={120 + i * 7.5}>{line}</text>
    {/each}

    {#each drops as [x, y, r, len, dark], i (i)}
      {#if dark}
        {#if len}<path d={trail(x, y, r, len)} fill="url(#{uid}-trail-dark)" />{/if}
        <path d={tear(x, y, r)} fill="#fff" opacity=".04" />
        <path d={rim(x, y, r)} class="can__rim" stroke-width={r * 0.22} />
        <circle cx={x - r * 0.3} cy={y - r * 0.25} r={r * 0.13} fill="#fff" opacity=".3" />
      {:else}
        {#if len}<path d={trail(x, y, r, len)} fill="url(#{uid}-trail)" />{/if}
        <path d={tear(x + r * 0.2, y + r * 0.35, r)} fill="#0b1420" opacity=".04" />
        <path d={tear(x, y, r)} fill="url(#{uid}-drop)" />
        <ellipse cx={x - r * 0.3} cy={y - r * 0.15} rx={r * 0.18} ry={r * 0.3} fill="#fff" opacity=".55" />
      {/if}
    {/each}
  </g>

  <path d="M27 12Q60 17 93 12L91 6Q60 1 29 6Z" fill="url(#{uid}-metal)" />
  <ellipse cx="60" cy="6.6" rx="31" ry="3.6" fill="#c5cad0" />
  <ellipse cx="60" cy="7" rx="27" ry="2.6" fill="#9aa1a9" />
  <ellipse cx="64" cy="7" rx="7" ry="1.3" fill="#d9dde1" />
  <path d="M29 6Q60 1 91 6" class="can__edge" />
</svg>

<style>
  .can {
    display: block;
    height: 100%;
    width: auto;
    filter: drop-shadow(0 16px 14px rgba(18, 19, 21, 0.2));
  }

  .can__base {
    fill: #f8f8f6;
  }

  .can__lower,
  .can__band-soft {
    fill: none;
  }

  .can__edge {
    fill: none;
    stroke: #fff;
    stroke-width: 0.6;
    opacity: 0.7;
  }

  .can__ink {
    fill: #17191c;
  }

  .can__rule {
    stroke: #17191c;
    stroke-width: 1.1;
  }

  .can__reverse text {
    fill: #f1f1ee;
  }

  .can__reverse .can__rule {
    stroke: #f1f1ee;
  }

  .can__rim {
    fill: none;
    stroke: #fff;
    stroke-linecap: round;
    opacity: 0.22;
  }

  .can__brand {
    font: 600 17px var(--ahti-sans);
    letter-spacing: 0.1em;
  }

  .can__name {
    font: 400 13.5px var(--ahti-display);
    letter-spacing: -0.01em;
  }

  .can__name.is-italic {
    font-style: italic;
  }

  .can__small {
    font: 400 5.6px var(--ahti-display);
  }

  .can__small--low {
    font-size: 5px;
  }

  .can--still .can__band {
    fill: #2f4f7a;
  }

  .can--still .can__band-soft {
    fill: #7fa0c4;
    opacity: 0.55;
  }

  .can--sparkling .can__band {
    fill: #1f3556;
  }

  .can--sparkling .can__lower {
    fill: #14161a;
  }

  .can--sparkling .can__small--low {
    fill: #f1f1ee;
  }

  .can--vadelma .can__band {
    fill: #f0c5cf;
  }

  .can--vadelma .can__band-soft {
    fill: #f7dfe4;
    opacity: 0.8;
  }

  .can__berry {
    fill: #c8455f;
  }
</style>
