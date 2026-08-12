import type { Metadata } from 'next'

import EditorialShell from '../components/EditorialShell'

export const metadata: Metadata = {
  title: 'About',
  description: 'Really Bad Security is a cybersecurity media, merch, and social shop with practical takes, sharp opinions, and useful jokes.',
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
          <p>Really Bad Security is a cybersecurity media, merch, and social shop for people who are tired of security theater—and still enjoy a good security joke. We take a pointed look at the defaults, handoffs, hype, and everyday shortcuts that turn normal work into avoidable risk, then turn those observations into practical guidance, sharp opinion, and shirts you can wear into the incident review.</p>
          <p>Our point of view is simple: security should be useful, honest, and a little less self-important. We publish the ideas, commentary, and satire here; we put the punchlines on the merch; and we carry the conversation into social media for anyone who has ever shipped a questionable fix, clicked approve, or discovered that “temporary” is a long-term architecture.</p>

          <h2>What it is not</h2>
          <p>RBS is not a cybersecurity services company, a vendor brochure, or a fear-based sales pitch dressed up as thought leadership. We are here to make security clearer, sharper, and a little harder to ignore.</p>

          <h2>Editorial standard</h2>
          <p>When we make factual security claims, we cite sources, note dates and limitations, and correct the record when needed.</p>
        </div>
      </section>
    </EditorialShell>
  )
}
