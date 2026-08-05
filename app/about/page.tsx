import type { Metadata } from 'next'

import EditorialShell from '../components/EditorialShell'

export const metadata: Metadata = {
  title: 'About',
  description: 'What Really Bad Security is for and how the editorial desk works.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <EditorialShell>
      <header className="read-page-header">
        <div className="container">
          <span className="eyebrow">Learn</span>
          <h1>About Us</h1>
          <p>Credible enough to use. Interesting enough to keep reading.</p>
        </div>
      </header>

      <section className="article" aria-labelledby="about-purpose-heading">
        <div className="container reading-width article-body">
          <h2 id="about-purpose-heading">What RBS is for</h2>
          <p>RBS makes security easier to see in the work people already do: the defaults, handoffs, and overlooked operational choices that create outsized risk. We publish practical guidance alongside clearly labeled opinion and satire, so readers always know what they are getting.</p>

          <h2>What it is not</h2>
          <p>RBS is not a cybersecurity services company, a vendor brochure, or a fear-based sales pitch. We are here to make security clearer, sharper, and a little harder to ignore.</p>

          <h2>Editorial standard</h2>
          <p>When we make factual security claims, we cite sources, note dates and limitations, and correct the record when needed.</p>
        </div>
      </section>
    </EditorialShell>
  )
}
