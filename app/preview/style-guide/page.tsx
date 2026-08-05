import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import EditorialShell from '../../components/EditorialShell'

export const metadata: Metadata = {
  title: 'RBS Style Board',
  description: 'Local review board for the Really Bad Security visual system.',
  robots: { index: false, follow: false },
}

const colors = [
  { name: 'RBS Navy', value: '#0D1B2A', role: 'Primary dark surface and dark text on light sections.' },
  { name: 'RBS Cream', value: '#F5F0E8', role: 'Primary light text on dark sections.' },
  { name: 'RBS Orange', value: '#E8621A', role: 'Primary accent, calls to action, and links.' },
  { name: 'RBS Pale Blue', value: '#E6EEF0', role: 'Light section surface and selected supporting text.' },
  { name: 'Goldilocks Blue', value: '#78BDE2', role: 'Primary readable body copy on dark RBS surfaces, derived from the shield bandage.' },
  { name: 'RBS Muted Blue', value: '#8BA3B8', role: 'Metadata, inactive navigation, and lower-priority labels.' },
  { name: 'RBS Rust', value: '#A64210', role: 'Accessible accent text on cream or pale-blue sections.' },
  { name: 'RBS Slate', value: '#435B6B', role: 'Body copy on cream and pale-blue sections.' },
] as const

const typeSamples = [
  {
    name: 'Geist Sans',
    role: 'Display and headline system',
    sample: 'Security is serious. The industry is ridiculous.',
    className: 'style-type-geist',
  },
  {
    name: 'Geist Mono',
    role: 'Labels, dates, metadata, and the wordmark tagline',
    sample: 'ARTICLES, PODCASTS, MERCH',
    className: 'style-type-mono',
  },
  {
    name: 'Arial / Helvetica',
    role: 'Current body-copy fallback system',
    sample: 'Clear language for complicated security work.',
    className: 'style-type-body',
  },
] as const

export default function StyleGuidePreviewPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <EditorialShell>
      <section className="style-board" aria-labelledby="style-board-title">
        <div className="container">
          <span className="eyebrow">Local review board</span>
          <h1 id="style-board-title">RBS color and type system</h1>
          <p className="style-board-intro">
            This is the actual palette and typography currently used by the homepage. It is a review surface only; it does not change the live visual system.
          </p>

          <section className="style-board-section" aria-labelledby="style-color-title">
            <div className="style-board-heading">
              <span className="label">Color tokens</span>
              <h2 id="style-color-title">Eight active text roles</h2>
            </div>
            <div className="style-color-grid">
              {colors.map((color) => (
                <article className="style-color-card" key={color.value}>
                  <div className="style-color-swatch" style={{ backgroundColor: color.value }} aria-hidden="true" />
                  <h3>{color.name}</h3>
                  <code>{color.value}</code>
                  <p>{color.role}</p>
                </article>
              ))}
            </div>
            <p className="style-board-note"><strong>Also active:</strong> <code>#FF7A33</code> is a bright-orange hover state, not a default text color. There is no pure black token: the dark text is RBS Navy.</p>
          </section>

          <section className="style-board-section" aria-labelledby="style-type-title">
            <div className="style-board-heading">
              <span className="label">Typography</span>
              <h2 id="style-type-title">Three active font systems</h2>
            </div>
            <div className="style-type-grid">
              {typeSamples.map((type) => (
                <article className="style-type-card" key={type.name}>
                  <span className="label">{type.role}</span>
                  <h3>{type.name}</h3>
                  <p className={type.className}>{type.sample}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </EditorialShell>
  )
}
