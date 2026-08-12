import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import type { EditorialEntry } from "../modules/editorial/editorial.types";

const sharedHomeEditorialCover = {
  src: "/media/security-signals/article-cover-template.png",
  alt: "Security Signals notebook-paper article cover.",
} as const;

export function SecuritySignalsIndex({ entries }: { entries: readonly EditorialEntry[] }) {
  const [featuredEntry, ...recentEntries] = entries

  return (
    <section className="read-index section">
      <div className="container reading-width">
        {!featuredEntry ? <div className="read-empty-state"><span className="eyebrow">Security Signals</span><h2>Signals are on the way.</h2><p>Published reading will appear here once it is ready.</p></div> : <>
          <EditorialPreviewCard entry={featuredEntry} variant="featured" />
          {recentEntries.length > 0 ? <section className="read-recent" aria-labelledby="recent-signals-title"><span className="eyebrow">Recent signals</span><h2 id="recent-signals-title">More from the desk</h2><div className="editorial-preview-grid">{recentEntries.map((entry) => <EditorialPreviewCard entry={entry} key={entry.frontmatter.id} />)}</div></section> : null}
        </>}
      </div>
    </section>
  );
}

export function EditorialNote({ entry, relatedEntries = [] }: { entry: EditorialEntry; relatedEntries?: readonly EditorialEntry[] }) {
  const blocks = entry.body.replace(/\r\n?/gu, "\n").split(/\n{2,}/u).filter(Boolean);
  return (
    <article className="article"><div className="container reading-width">
      <header className="article-header">
        <span className="label">{entry.frontmatter.format} · Really Bad Security</span>
        <h1 className="article-title">{entry.frontmatter.title}</h1>
        <p className="article-lede">{entry.frontmatter.summary}</p>
        <p className="meta">{entry.frontmatter.authors.map((author) => author.name).join(", ")} · {entry.frontmatter.publishedAt?.slice(0, 10)}{entry.frontmatter.updatedAt ? ` · Updated ${entry.frontmatter.updatedAt.slice(0, 10)}` : ""}</p>
      </header>
      <div className="article-body">
        {blocks.map((block) => renderBlock(block))}
      </div>
      {entry.frontmatter.sources.length > 0 ? <section className="source-box" aria-labelledby="sources-title"><span className="eyebrow" id="sources-title">Sources</span><ul>{entry.frontmatter.sources.map((source) => <li key={source.url}><a href={source.url}>{source.title}</a>{source.publisher ? ` — ${source.publisher}` : ""}</li>)}</ul></section> : null}
      {relatedEntries.length > 0 ? <section className="related-signals" aria-labelledby="related-signals-title"><span className="eyebrow">Related signals</span><h2 id="related-signals-title">Keep reading</h2><div className="editorial-preview-grid">{relatedEntries.map((relatedEntry) => <EditorialPreviewCard entry={relatedEntry} key={relatedEntry.frontmatter.id} />)}</div></section> : null}
      <nav className="article-next-links" aria-label="Continue exploring"><Link className="text-link" href="/security-signals">← Back to Read</Link><Link className="text-link" href="/watch">Watch</Link><Link className="text-link" href="/shop">Merch</Link></nav>
    </div></article>
  );
}

export function EditorialPreviewCard({ entry, variant = 'standard', href, kicker, dateLabel, showKicker = true, summary }: { entry: EditorialEntry; variant?: 'featured' | 'standard' | 'home' | 'series'; href?: string; kicker?: string; dateLabel?: string; showKicker?: boolean; summary?: string }) {
  const { frontmatter } = entry
  const localCover = getApprovedLocalCover(entry)
  const cover = variant === 'home' || variant === 'featured'
    ? sharedHomeEditorialCover
    : localCover ?? (variant === 'standard' ? sharedHomeEditorialCover : undefined)
  const className = `editorial-preview-card editorial-preview-card-${variant}${cover ? ' has-cover' : ''}`
  const articleHref = href ?? `/security-signals/${frontmatter.slug}`
  const titleInArtwork = variant === 'home' || variant === 'standard' || variant === 'featured'
  const titleSizeClass = frontmatter.title.length > 44
    ? ' editorial-preview-title-dense'
    : frontmatter.title.length > 28
      ? ' editorial-preview-title-long'
      : ''

  return <article className={className}>
    {cover ? titleInArtwork ? <div className="editorial-preview-art editorial-preview-art-titled"><Image className="editorial-preview-image" src={cover.src} alt={cover.alt} width={1200} height={675} /><h2 className={`editorial-preview-title${titleSizeClass}`}><Link href={articleHref}>{frontmatter.title}</Link></h2></div> : variant === 'series' ? <div className="editorial-preview-art"><Image className="editorial-preview-image" src={cover.src} alt={cover.alt} width={1200} height={675} /><span aria-hidden="true">{frontmatter.title}</span></div> : <Image className="editorial-preview-image" src={cover.src} alt={cover.alt} width={1200} height={675} /> : null}
    <div className="editorial-preview-copy">
      {showKicker && !titleInArtwork ? <span className="label">{kicker ?? `${frontmatter.format} · published`}</span> : null}
      {!titleInArtwork ? <Link href={articleHref}><h2>{frontmatter.title}</h2></Link> : null}
      <p>{summary ?? frontmatter.summary}</p>
      <Link className="text-link" href={articleHref}>Read signal →</Link>
      <p className="meta">{dateLabel ?? frontmatter.publishedAt?.slice(0, 10) ?? frontmatter.updatedAt?.slice(0, 10)}</p>
    </div>
  </article>
}

function getApprovedLocalCover(entry: EditorialEntry) {
  const image = entry.frontmatter.image
  return image?.src.startsWith('/media/security-signals/') ? image : undefined
}

function renderBlock(block: string) {
  const text = block.replace(/\r\n?/gu, "\n").trim();
  const lines = text.split("\n").map(unescapeMarkdownPunctuation);
  const firstLine = lines[0] ?? "";
  const secondLine = lines[1] ?? "";
  if (/^=+\s*$/u.test(secondLine) || /^-+\s*$/u.test(secondLine)) return <h2 key={text}>{inlineMarkdown(firstLine)}</h2>;
  if (lines.length === 1 && /^\*\*[^*]+\*\*$/u.test(firstLine)) return <h2 key={text}>{inlineMarkdown(firstLine)}</h2>;
  if (firstLine.startsWith("### ")) return <h3 key={text}>{inlineMarkdown(firstLine.slice(4))}</h3>;
  if (firstLine.startsWith("## ")) return <h2 key={text}>{inlineMarkdown(firstLine.slice(3))}</h2>;
  if (lines.every((line) => line.startsWith("- "))) return <ul key={text}>{lines.map((line) => <li key={line}>{inlineMarkdown(line.slice(2))}</li>)}</ul>;
  return <p key={text}>{inlineMarkdown(text)}</p>;
}

function inlineMarkdown(value: string): ReactNode {
  const matcher = /(\[[^\]]+\]\(https:\/\/[^\s)]+\)|\*\*[^*]+\*\*|\+\+[^+]+\+\+|\*[^*]+\*|_[^_]+_)/gu;
  return unescapeMarkdownPunctuation(value).split(matcher).filter(Boolean).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/u);
    if (link) return <a href={link[2]} key={index} rel="noreferrer" target="_blank">{link[1]}</a>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("++") && part.endsWith("++")) return <u key={index}>{part.slice(2, -2)}</u>;
    if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function unescapeMarkdownPunctuation(value: string): string {
  return value.replaceAll("\\-", "-").replaceAll("\\[", "[").replaceAll("\\]", "]").replaceAll("\\*", "*").replaceAll("\\_", "_").replaceAll("\\+", "+");
}
