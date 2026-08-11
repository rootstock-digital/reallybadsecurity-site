import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import EditorialShell from './components/EditorialShell'
import { EditorialPreviewCard } from './components/EditorialNote'
import { HomeWatchModule } from './components/VideoExperience'
import { rbsEditorialSchemaOptions } from './config/editorial'
import { getRequestPublicEditorialEntries } from './modules/editorial/editorial.request-loader'
import { editorialSeriesLabels } from './modules/editorial/editorial.types'
import type { EditorialEntry } from './modules/editorial/editorial.types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Security, technology, and the bad defaults underneath',
  description: 'Really Bad Security is an editorial desk for practical security thinking, internet work, and sharp commentary.',
  alternates: { canonical: '/' },
}

const homePreviewSlugs = [
  'implemented-is-not-operational',
  'boring-security-beats-new-toys',
] as const

const featuredMerch = [
  {
    title: 'Vibe Codes Only Tee',
    href: '/shop/vibe-codes-only-tee',
    image: 'https://shop.reallybadsecurity.com/cdn/shop/files/unisex-staple-t-shirt-black-front-6a725a4a7f6ba.jpg?v=1785879126&width=1946',
    alt: 'Product photograph of the Vibe Codes Only T-shirt.',
  },
  {
    title: 'Currently Being Shadowbanned Tee',
    href: '/shop/currently-being-shadowbanned-tee-1',
    image: 'https://shop.reallybadsecurity.com/cdn/shop/files/unisex-staple-t-shirt-black-front-6a724c559439c.jpg?v=1785875554&width=1946',
    alt: 'Product photograph of the Currently Being Shadowbanned T-shirt.',
  },
  {
    title: 'Do You Even Vibe Code Bro Tee',
    href: '/shop/do-you-even-vibe-code-bro-tee',
    image: 'https://shop.reallybadsecurity.com/cdn/shop/files/unisex-staple-t-shirt-black-front-2-6a725714ec2e2.jpg?v=1785878303&width=1946',
    alt: 'Product photograph of the Do You Even Vibe Code Bro T-shirt.',
  },
] as const

export default async function Home() {
  const publishedEntries = await getRequestPublicEditorialEntries(rbsEditorialSchemaOptions)
  const previewEntries = homeArticleEntries(publishedEntries)

  return (
    <EditorialShell>
      <section className="hero" aria-labelledby="home-hero-heading">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-eyebrow">Cybersecurity for humans</span>
            <h1 id="home-hero-heading">
              <span>Making</span>
              <span className="hero-word-accent">Really Bad Security</span>
              <span>Good.</span>
            </h1>
            <p>Breaking down the complexity of cybersecurity and making technology discussions a little more human.</p>
          </div>
          <div className="hero-shield-stage">
            <div className="hero-signal-composition">
              <div className="hero-signal-ping hero-signal-ping-primary" aria-hidden="true" />
              <div className="hero-signal-ping hero-signal-ping-secondary" aria-hidden="true" />
              <div className="hero-signal-ping hero-signal-ping-tertiary" aria-hidden="true" />
              <div className="hero-shield-mark">
                <Image className="hero-shield" src="/rbs-shield-only-logo.png" alt="Really Bad Security shield with a bandage" width={340} height={340} priority unoptimized />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-read" aria-labelledby="signals-heading">
        <div className="container">
          <div className="home-module-heading">
            <div>
              <span className="eyebrow">Read</span>
              <h2 id="signals-heading" className="section-heading">The Articles</h2>
            </div>
          </div>
          {previewEntries.length ? <div className="signal-experience signal-experience-home">
            {previewEntries.map((entry) => <section className="signal-series" key={entry.frontmatter.id} aria-labelledby={`home-${entry.frontmatter.slug}`}>
              <div className="signal-series-heading">
                <h3 id={`home-${entry.frontmatter.slug}`}>{seriesLabel(entry.frontmatter.series)}</h3>
              </div>
              <div className="signal-grid">
                <EditorialPreviewCard entry={entry} summary={teaser(entry.frontmatter.summary, 132)} variant="home" showKicker={false} dateLabel={`Published · ${entry.frontmatter.publishedAt?.slice(0, 10)}`} />
              </div>
            </section>)}
          </div> : <div className="home-read-intro">
            <p>Practical takes on the systems, defaults, and decisions that make security better—or worse.</p>
            <Link className="text-link" href="/security-signals">Explore Security Signals →</Link>
          </div>}
        </div>
      </section>

      <section className="section home-watch" aria-labelledby="home-watch-heading">
        <div className="container">
          <div className="home-module-heading">
            <div>
              <span className="eyebrow">WATCH</span>
              <h2 id="home-watch-heading" className="section-heading">The Podcasts</h2>
            </div>
            <Link className="text-link" href="/watch">See all videos →</Link>
          </div>
          <HomeWatchModule />
        </div>
      </section>

      <section className="section home-merch" aria-labelledby="shop-heading">
        <div className="container">
          <div className="home-module-heading">
            <div>
              <span className="eyebrow">Buy</span>
              <h2 id="shop-heading" className="section-heading">The Merch</h2>
            </div>
          </div>
          <div className="goods-panel">
            <div className="merch-intro">
              <h3>Security is serious. The industry is ridiculous.</h3>
              <p>RBS merch is for people who do the work, survive the jargon, and still have enough perspective to laugh at the absurd parts.</p>
              <Link href="/shop">Visit RBS Merch →</Link>
            </div>
            <div className="merch-featured" aria-label="Featured RBS merch">
              {featuredMerch.map((product) => <a className="merch-card" href={product.href} key={product.href}>
                <Image className="merch-card-image" src={product.image} alt={product.alt} width={1024} height={1024} sizes="(max-width: 760px) 100vw, 26vw" />
                <span>{product.title}</span>
                <small>See it in the shop →</small>
              </a>)}
            </div>
          </div>
        </div>
      </section>

      <section className="home-join" aria-labelledby="connect-heading">
        <div className="container">
          <div className="home-module-heading">
            <div>
              <span className="eyebrow">Join</span>
              <h2 id="connect-heading" className="section-heading">The Community</h2>
            </div>
          </div>
          <div className="join-panel">
            <div className="join-intro">
              <h3>Security signals, without the vendor fog.</h3>
              <p>News and information about real threat activity, real vulnerabilities, and real awareness tips—no vendor fluff, no fear-mongering, no security theater. Just what&apos;s actually worth knowing.</p>
              <Link className="text-link" href="/join">Join the community →</Link>
            </div>
            <ul className="join-topics" aria-label="What the RBS newsletter will cover">
              <li><strong>Current observations</strong><span>The developments worth noticing before they become everybody&apos;s problem.</span></li>
              <li><strong>Threat actors in the wild</strong><span>How the loudest operators are moving, adapting, and making a mess.</span></li>
              <li><strong>Serious vulnerabilities</strong><span>Clear context on flaws that deserve action—not just a dramatic headline.</span></li>
              <li><strong>Awareness that sticks</strong><span>Practical tips and tricks that treat people like people.</span></li>
            </ul>
          </div>
        </div>
      </section>
    </EditorialShell>
  )
}

function homeArticleEntries(entries: readonly EditorialEntry[]): EditorialEntry[] {
  const withoutFixture = entries.filter((entry) => entry.frontmatter.slug !== 'published-editorial-fixture')
  const bySlug = new Map(withoutFixture.map((entry) => [entry.frontmatter.slug, entry]))
  const curated = homePreviewSlugs.map((slug) => bySlug.get(slug)).filter((entry): entry is EditorialEntry => Boolean(entry))
  const remaining = withoutFixture.filter((entry) => !homePreviewSlugs.includes(entry.frontmatter.slug as (typeof homePreviewSlugs)[number]))
  return [...remaining, ...curated].slice(0, 2)
}

function seriesLabel(series: string): string {
  return editorialSeriesLabels[series as keyof typeof editorialSeriesLabels] ?? series.replace(/-/gu, ' ')
}

function teaser(value: string, maximumLength: number): string {
  if (value.length <= maximumLength) return value
  const shortened = value.slice(0, maximumLength - 1).replace(/\s+\S*$/u, '').trim()
  return `${shortened || value.slice(0, maximumLength - 1).trim()}…`
}
