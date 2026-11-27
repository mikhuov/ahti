<script lang="ts">
  import type {StepArtName} from '$lib/stepArt'

  let {name}: {name: StepArtName} = $props()

  const wave = (x0: number, y: number, n: number, w = 20, h = 7) =>
    `M${x0} ${y} q${w / 2} ${-h} ${w} 0` + ` t${w} 0`.repeat(n - 1)

  const plus = (x: number, y: number, s = 4) => `M${x - s} ${y}H${x + s}M${x} ${y - s}V${y + s}`

  const cloud = (x: number, y: number) =>
    `M${x} ${y}C${x - 12} ${y} ${x - 14} ${y - 16} ${x - 2} ${y - 18}` +
    `C${x - 2} ${y - 32} ${x + 16} ${y - 40} ${x + 26} ${y - 28}` +
    `C${x + 32} ${y - 36} ${x + 46} ${y - 34} ${x + 48} ${y - 22}` +
    `C${x + 60} ${y - 22} ${x + 62} ${y - 4} ${x + 50} ${y}Z`

  const gravel = [
    [74, 118], [78, 134], [128, 120], [132, 138], [182, 132], [222, 124], [20, 118], [68, 152],
    [116, 152], [176, 152], [150, 150], [96, 154],
  ]
  const ridgeGravel = [
    [100, 108], [112, 100], [132, 104], [146, 112], [92, 124], [150, 126], [120, 124], [108, 130],
    [136, 130],
  ]
  const sand = [50, 58, 66].flatMap((y, row) =>
    Array.from({length: 17}, (_, i) => [18 + i * 12 + (row % 2) * 6, y + ((i * 7) % 3)]),
  )
  const stones = [90, 101].flatMap((y, row) =>
    Array.from({length: 12}, (_, i) => [22 + i * 18 + (row % 2) * 9, y]),
  )
</script>

<svg class="art" viewBox="0 0 240 180" aria-hidden="true">
  {#if name === 'ice'}
    <path class="ice" d="M80 12V30M73 23L80 30L87 23M120 8V26M113 19L120 26L127 19M160 12V30M153 23L160 30L167 23" />
    <path
      class="ink paper"
      d="M16 96C20 70 48 50 92 44C132 38 182 44 210 62C220 70 224 82 224 96Z"
    />
    <path class="ice" d="M40 74C80 62 160 60 206 74M28 86C80 78 168 78 218 88" />
    <path class="ink" d="M8 104C60 100 140 108 232 102" />
    <path
      class="ink"
      d="M30 124L50 116L66 126L58 140L36 138ZM88 120L110 114L120 130L100 140L86 132ZM140 122L162 116L174 128L164 142L144 138ZM190 120L206 116L216 130L198 138Z"
    />
    {#each gravel as [cx, cy] (`${cx}-${cy}`)}<circle class="dot" {cx} {cy} r="1.8" />{/each}
  {:else if name === 'ridges'}
    <path class="ink" d="M8 140C70 136 170 142 232 138" />
    <path class="ink" d="M26 139C66 138 88 74 120 72C152 70 176 138 214 139" />
    <path
      class="ice"
      d="M54 132C80 122 96 96 120 94C144 92 160 122 186 132M78 136C96 128 106 114 120 113C136 112 146 126 164 136"
    />
    {#each ridgeGravel as [cx, cy] (`${cx}-${cy}`)}<circle class="dot-ink" {cx} {cy} r="1.3" />{/each}
    <path class="ink" d="M104 74L110 50L116 74ZM110 74V79M125 72L130 56L135 72ZM130 72V77" />
    <path class="ice" d="M22 154C42 152 62 156 82 154M158 154C178 152 198 156 218 154" />
  {:else if name === 'rain'}
    <path class="ink paper" d={cloud(58, 76)} />
    <path class="ink paper" d={cloud(144, 68)} />
    <path
      class="ice"
      d="M66 88L62 98M78 88L74 98M90 88L86 98M102 88L98 98M70 104L66 114M84 104L80 114M96 104L92 114"
    />
    <path
      class="ice"
      d="{plus(156, 82)}{plus(180, 80)}{plus(168, 94)}{plus(158, 106)}{plus(180, 106)}"
    />
    <path class="ink" d="M24 126C70 124 100 130 130 128C160 126 190 124 220 126" />
    <path class="ice" d="M50 138V152M82 136V156M114 138V152M146 136V156M178 138V152" />
  {:else if name === 'filter'}
    <path class="ice" d="M60 14V22M100 10V18M140 16V24M180 12V20" />
    <path class="ink" d="M10 40C70 36 170 44 230 38" />
    <path class="ink" d="M30 39l-2-6M33 39l1-7M36 39l3-5M196 39l-2-6M199 39l1-7M202 39l3-5" />
    {#each sand as [cx, cy] (`${cx}-${cy}`)}<circle class="dot-ink" {cx} {cy} r="0.9" />{/each}
    <path class="ink thin" d="M10 78C80 74 160 82 230 76" />
    {#each stones as [cx, cy] (`${cx}-${cy}`)}<circle class="ink" {cx} {cy} r="3.2" />{/each}
    <path class="ice" d="M10 112C70 108 170 116 230 110" />
    <path class="ice" d="{wave(20, 128, 10)}{wave(30, 142, 9)}{wave(20, 156, 10)}" />
    <path class="ice dash" d="M70 46V104M120 46V104M170 46V104" />
    <path class="ice" d="M64 98L70 106L76 98M114 98L120 106L126 98M164 98L170 106L176 98" />
  {:else if name === 'soft'}
    <path
      class="ink"
      d="M120 18C110 36 84 66 84 92C84 114 100 128 120 128C140 128 156 114 156 92C156 66 130 36 120 18Z"
    />
    <path class="ice" d="M100 84C100 70 108 56 114 48" />
    <path class="ice" d="{wave(92, 102, 4, 14, 5)}{wave(99, 114, 3, 14, 5)}" />
    <path class="ink" d="M20 150H220M20 166H220M48 150V166M92 150V166M140 150V166M186 150V166" />
    <circle class="dot" cx="70" cy="142" r="1.6" />
    <circle class="dot" cx="166" cy="140" r="1.6" />
  {:else if name === 'ahti'}
    <path class="ice" d="M120 22V32M96 30L101 37M144 30L139 37M64 46L71 50M176 46L169 50" />
    <path class="ink paper" d="M84 92L78 54L101 74L120 44L139 74L162 54L156 92Z" />
    <path class="ink paper" d="M84 92H156V102H84Z" />
    <circle class="ink paper" cx="78" cy="54" r="3.5" />
    <circle class="ink paper" cx="120" cy="44" r="3.5" />
    <circle class="ink paper" cx="162" cy="54" r="3.5" />
    <circle class="dot" cx="120" cy="97" r="2.4" />
    <path class="ice" d="{wave(40, 124, 8)}{wave(60, 140, 6)}{wave(80, 156, 4)}" />
  {/if}
</svg>

<style>
  .art {
    display: block;
    width: 84%;
    height: auto;
    overflow: visible;
  }

  .ink,
  .ice {
    fill: none;
    stroke-width: 1.6px;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .ink {
    stroke: #17191c;
  }

  .ice {
    stroke: var(--ahti-ice);
  }

  .thin {
    stroke-width: 1px;
    opacity: 0.6;
  }

  .dash {
    stroke-dasharray: 3 5;
  }

  .paper {
    fill: #fff;
  }

  .dot {
    fill: var(--ahti-ice);
  }

  .dot-ink {
    fill: #17191c;
  }
</style>
