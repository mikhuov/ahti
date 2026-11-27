<script lang="ts">
  import {imageSrc} from '$lib/sanity/image'
  import type {SiteSettings} from '$lib/sanity/types'
  import {clean, hrefOf, isExternal} from '$lib/utils/links'
  import Button from './Button.svelte'

  let {settings}: {settings: SiteSettings | null | undefined} = $props()

  const logo = $derived(imageSrc(settings?.logo, 320))
</script>

<footer class="ftr" data-section="footer">
  <div class="wrap">
    <div class="ftr__grid">
      <div class="ftr__brand">
        {#if logo}
          <img class="ftr__logo" src={logo} alt={clean(settings?.siteName) ?? ''} loading="lazy" />
        {/if}
        {#if settings?.footerTagline}<p class="ftr__line">{settings.footerTagline}</p>{/if}
        <Button link={settings?.footerButton} variant="light" />
      </div>
      {#each settings?.footerColumns ?? [] as column (column._key)}
        <nav class="ftr__col" aria-label={column.title}>
          <p class="eyebrow">{column.title}</p>
          {#each column.links ?? [] as link (link._key)}
            <a
              href={hrefOf(link.href)}
              target={isExternal(link.href) ? '_blank' : undefined}
              rel={isExternal(link.href) ? 'noopener' : undefined}>{link.label}</a
            >
          {/each}
        </nav>
      {/each}
    </div>
    <div class="ftr__base">
      <span>{settings?.legal}</span>
      <span>{settings?.footerNote}</span>
    </div>
  </div>
</footer>

<style>
  .ftr {
    background: var(--ahti-ink);
    color: #f2f1ed;
    padding: clamp(64px, 7vw, 104px) 0 28px;
  }

  .ftr__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) repeat(4, minmax(0, 1fr));
    gap: clamp(28px, 3vw, 48px);
  }

  .ftr__logo {
    height: 30px;
    width: auto;
    filter: invert(1);
  }

  .ftr__line {
    margin: 22px 0 28px;
    font: 350 clamp(26px, 2.4vw, 36px) / 1.1 var(--ahti-display);
    letter-spacing: -0.02em;
    max-width: 16ch;
  }

  .ftr__col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .ftr__col .eyebrow {
    color: #ffffff80;
    margin-bottom: 16px;
  }

  .ftr__col a {
    font: 400 15px/1.3 var(--ahti-sans);
    color: #fffc;
    padding: 6px 0;
    transition:
      color 0.3s,
      transform 0.4s var(--ease);
  }

  .ftr__col a:hover {
    color: #fff;
    transform: translate(3px);
  }

  .ftr__base {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    margin-top: clamp(48px, 6vw, 88px);
    padding-top: 22px;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
    font: 400 13px/1.4 var(--ahti-sans);
    color: #ffffff8c;
  }

  @media (max-width: 989px) {
    .ftr__grid {
      grid-template-columns: 1fr 1fr;
    }

    .ftr__brand {
      grid-column: 1 / -1;
    }
  }
</style>
