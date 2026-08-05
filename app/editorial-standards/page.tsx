import type { Metadata } from 'next'

import EditorialShell from '../components/EditorialShell'

export const metadata: Metadata = {
  title: 'Editorial Standards',
  description: 'How Really Bad Security approaches reporting, sources, corrections, opinion, and satire.',
  alternates: { canonical: '/editorial-standards' },
}

export default function EditorialStandardsPage() {
  return (
    <EditorialShell>
      <header className="read-page-header">
        <div className="container">
          <span className="eyebrow">RBS</span>
          <h1>Editorial Standards</h1>
          <p>Clear labels, credible sources, and room to call out nonsense when it earns it.</p>
        </div>
      </header>

      <section className="article" aria-labelledby="standards-heading">
        <div className="container reading-width article-body">
          <h2 id="standards-heading">How we work</h2>
          <p>Factual security claims should be supported by sources that readers can examine. We include publication dates and relevant limitations where they help explain what a source can—and cannot—show.</p>

          <h2>Labels matter</h2>
          <p>Reporting and practical guidance are distinct from opinion, satire, and promotion. We label those formats so readers can understand the context before they draw conclusions or act on an idea.</p>

          <h2>Corrections</h2>
          <p>When we get a material fact wrong, we will correct it clearly and promptly. If you spot an error or have a concern about an article, please let us know.</p>
        </div>
      </section>
    </EditorialShell>
  )
}
