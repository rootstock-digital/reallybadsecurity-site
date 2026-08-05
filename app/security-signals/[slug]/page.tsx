import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { rbsEditorialConfig, rbsEditorialSchemaOptions, rbsEditorialSite } from "../../config/editorial";
import { EditorialNote } from "../../components/EditorialNote";
import EditorialShell from "../../components/EditorialShell";
import { getRequestPublicEditorialEntries, getRequestPublicEditorialEntryBySlug } from "../../modules/editorial/editorial.request-loader";
import { getEditorialArticleMetadata } from "../../modules/editorial/editorial.routes";
import { getRelatedEditorialEntries } from "../../modules/editorial/editorial.related";
import { getEditorialArticleStructuredData } from "../../modules/editorial/editorial.structured-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entry = await getRequestPublicEditorialEntryBySlug((await params).slug, rbsEditorialSchemaOptions);
  return entry ? getEditorialArticleMetadata(entry, rbsEditorialConfig, rbsEditorialSite.origin) : {};
}

export default async function SecuritySignalPage({ params }: { params: Promise<{ slug: string }> }) {
  const entry = await getRequestPublicEditorialEntryBySlug((await params).slug, rbsEditorialSchemaOptions);
  if (!entry) notFound();
  const relatedEntries = getRelatedEditorialEntries(entry, { entries: await getRequestPublicEditorialEntries(rbsEditorialSchemaOptions) });
  const structuredData = getEditorialArticleStructuredData(entry, rbsEditorialConfig, rbsEditorialSite.origin, rbsEditorialSite.publisher);
  return <EditorialShell>{structuredData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /> : null}<EditorialNote entry={entry} relatedEntries={relatedEntries} /></EditorialShell>;
}
