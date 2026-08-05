import { notFound } from 'next/navigation'

import EditorialShell from '../../components/EditorialShell'
import { EditorialPreviewCard } from '../../components/EditorialNote'
import { HomeWatchModule } from '../../components/VideoExperience'
import { rbsEditorialSchemaOptions } from '../../config/editorial'
import { getAllEditorialEntries, isEditorialPreviewEnabled } from '../../modules/editorial/editorial.loader'
import { editorialSeriesLabels } from '../../modules/editorial/editorial.types'

const previewSlugs = [
  'implemented-is-not-operational',
  'boring-security-beats-new-toys',
] as const

export default function HomePreviewPage() {
  if (!isEditorialPreviewEnabled()) notFound()

  const entriesBySlug = new Map(
    getAllEditorialEntries(undefined, rbsEditorialSchemaOptions)
      .filter((entry) => entry.frontmatter.status === 'in_review')
      .map((entry) => [entry.frontmatter.slug, entry]),
  )
  const previewEntries = previewSlugs.map((slug) => entriesBySlug.get(slug))

  if (previewEntries.some((entry) => !entry)) notFound()

  return (
    <EditorialShell>
      <div className="home-preview">
        <section className="home-read home-preview-section" aria-labelledby="preview-signals-heading">
          <div className="container">
            <div className="home-module-heading">
              <div>
                <span className="eyebrow">Read</span>
                <h1 id="preview-signals-heading" className="section-heading">Security Signals</h1>
              </div>
            </div>
            <div className="signal-experience signal-experience-home">
              {previewEntries.map((entry) => entry ? <section className="signal-series" key={entry.frontmatter.id} aria-labelledby={`preview-${entry.frontmatter.slug}`}>
                <div className="signal-series-heading">
                  <h2 id={`preview-${entry.frontmatter.slug}`}>{editorialSeriesLabels[entry.frontmatter.series]}</h2>
                </div>
                <div className="signal-grid">
                  <EditorialPreviewCard entry={entry} variant="series" showKicker={false} dateLabel={`In review · ${entry.frontmatter.updatedAt?.slice(0, 10)}`} href={`/preview/home#${entry.frontmatter.slug}`} />
                </div>
              </section> : null)}
            </div>
          </div>
        </section>

        <section className="section home-watch home-preview-section" aria-labelledby="preview-watch-heading">
          <div className="container">
            <div className="home-module-heading">
              <div>
                <span className="eyebrow">Watch</span>
                <h2 id="preview-watch-heading" className="section-heading">The Podcasts</h2>
              </div>
            </div>
            <HomeWatchModule />
          </div>
        </section>
      </div>
    </EditorialShell>
  )
}
