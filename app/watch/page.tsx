import type { Metadata } from 'next'

import EditorialShell from '../components/EditorialShell'
import { WatchSeries } from '../components/VideoExperience'

export const metadata: Metadata = {
  title: 'Watch',
  description: 'Security conversations, practical demos, and the context around the work.',
  alternates: { canonical: '/watch' },
  openGraph: {
    title: 'Watch | Really Bad Security',
    description: 'Security conversations, practical demos, and the context around the work.',
    url: '/watch',
  },
}

export default function WatchPage() {
  return (
    <EditorialShell>
      <header className="watch-page-header">
        <div className="container">
          <span className="eyebrow">WATCH</span>
          <h1>The Podcasts</h1>
          <p>Security leadership conversations and real vendor demos, all in one place.</p>
          <div className="watch-program-labels" aria-label="Featured podcast series">
            <span>Authenticated Access</span>
            <span>Not Another Demo</span>
          </div>
        </div>
      </header>

      <section className="section watch-series-section">
        <div className="container"><WatchSeries /></div>
      </section>
    </EditorialShell>
  )
}
