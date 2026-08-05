import type { Metadata } from 'next'

import { SecuritySignalsIndex } from '../components/EditorialNote'
import EditorialShell from '../components/EditorialShell'
import { rbsEditorialSchemaOptions } from '../config/editorial'
import { getRequestPublicEditorialEntries } from '../modules/editorial/editorial.request-loader'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Security Signals',
  description: 'Short, durable RBS security signals and social-post expansions.',
  alternates: { canonical: '/security-signals' },
}

export default async function SecuritySignalsPage() {
  const entries = await getRequestPublicEditorialEntries(rbsEditorialSchemaOptions)
  return (
    <EditorialShell>
      <header className="read-page-header">
        <div className="container">
          <span className="eyebrow">Read</span>
          <h1>Security Signals</h1>
          <p>Useful security and internet-work observations with enough room to be clear.</p>
          <div className="read-program-labels" aria-label="Featured article series">
            <span>Operational Readiness</span>
            <span>Bad Defaults</span>
            <span>Human Layer</span>
            <span>Attack Surface</span>
            <span>Incident Reality</span>
            <span>Security Theater</span>
          </div>
        </div>
      </header>
      <SecuritySignalsIndex entries={entries} />
    </EditorialShell>
  )
}
