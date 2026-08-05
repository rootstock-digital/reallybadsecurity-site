import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { EditorialNote } from '../../../components/EditorialNote'
import EditorialShell from '../../../components/EditorialShell'
import { rbsEditorialSchemaOptions } from '../../../config/editorial'
import { getAllEditorialEntries } from '../../../modules/editorial/editorial.loader'
import { getRelatedEditorialEntries } from '../../../modules/editorial/editorial.related'

export const dynamicParams = false

function getInReviewEntries() {
  if (process.env.NODE_ENV === 'production') return []

  return getAllEditorialEntries(undefined, rbsEditorialSchemaOptions)
    .filter((entry) => entry.frontmatter.status === 'in_review')
}

export function generateStaticParams() {
  return getInReviewEntries().map((entry) => ({ slug: entry.frontmatter.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const entry = getInReviewEntries().find((candidate) => candidate.frontmatter.slug === slug)

  return entry ? {
    title: `${entry.frontmatter.title} | Preview | Really Bad Security`,
    description: entry.frontmatter.summary,
    robots: { index: false, follow: false },
  } : {}
}

export default async function PreviewSecuritySignalPage({ params }: { params: Promise<{ slug: string }> }) {
  const entries = getInReviewEntries()
  const { slug } = await params
  const entry = entries.find((candidate) => candidate.frontmatter.slug === slug)
  if (!entry) notFound()

  return <EditorialShell><EditorialNote entry={entry} relatedEntries={getRelatedEditorialEntries(entry, { entries })} /></EditorialShell>
}
