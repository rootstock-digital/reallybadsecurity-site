"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { createEditorialDraft, updateEditorialDraft } from "./actions";
import RichTextEditor from "./RichTextEditor";
import type { EditorialAdminEntry } from "../modules/editorial-admin";

const seriesOptions = [
  { label: "Operational Readiness", value: "operational-readiness" },
  { label: "Bad Defaults", value: "bad-defaults" },
  { label: "Human Layer", value: "human-layer" },
  { label: "Attack Surface", value: "attack-surface" },
  { label: "Incident Reality", value: "incident-reality" },
  { label: "Security Theater", value: "security-theater" },
];
const addAnotherSeries = "add-another";

export default function EditorialDraftForm({ entry }: { entry?: EditorialAdminEntry }) {
  const titleRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const seoTitleRef = useRef<HTMLInputElement>(null);
  const seoDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const existingSeries = entry && seriesOptions.some((option) => option.value === entry.series) ? entry.series : undefined;
  const [canonicalMode, setCanonicalMode] = useState(entry?.canonicalMode ?? "owner-decision-required");
  const [bodyMarkdown, setBodyMarkdown] = useState(entry?.body ?? "");
  const [series, setSeries] = useState(existingSeries ?? (entry ? addAnotherSeries : seriesOptions[0].value));
  const [customSeries, setCustomSeries] = useState(existingSeries ? "" : entry?.series ?? "");
  const [slugWasEdited, setSlugWasEdited] = useState(false);

  function createStarterSeo() {
    const title = titleRef.current?.value.trim() ?? "";
    const summary = summaryRef.current?.value.trim() || stripMarkdown(bodyMarkdown);
    if (seoTitleRef.current) seoTitleRef.current.value = trimAtWord(`${title} | Really Bad Security`, 60);
    if (seoDescriptionRef.current) seoDescriptionRef.current.value = trimAtWord(summary, 155);
    if (slugRef.current && !slugRef.current.value.trim()) slugRef.current.value = slugify(title);
  }

  return (
    <form action={entry ? updateEditorialDraft : createEditorialDraft} className="editorial-admin-form">
      {entry ? <><input name="id" type="hidden" value={entry.id} /><input name="expectedVersion" type="hidden" value={entry.version} /></> : null}
      <label>
        Title
        <span className="editorial-admin-hint">The reader-facing headline.</span>
        <input
          ref={titleRef}
          name="title"
          required
          onChange={(event) => {
            if (!slugWasEdited && slugRef.current) slugRef.current.value = slugify(event.currentTarget.value);
          }}
          defaultValue={entry?.title}
        />
      </label>
      <label>
        URL slug
        <span className="editorial-admin-hint">Created automatically from the title. You can adjust it if you need a different clean address after <code>/security-signals/</code>.</span>
        <input ref={slugRef} name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="clear-security-title" defaultValue={entry?.slug} onChange={() => setSlugWasEdited(true)} />
      </label>
      <label>
        Summary
        <span className="editorial-admin-hint">One or two sentences for article cards and the starting point for search-preview help.</span>
        <textarea ref={summaryRef} name="summary" required rows={3} defaultValue={entry?.summary} />
      </label>
      <input name="format" type="hidden" value="article" />
      <label>
        Series
        <span className="editorial-admin-hint">Choose the collection this article belongs to. These are set during site onboarding, so writers do not need to invent a category each time.</span>
        <select value={series} onChange={(event) => setSeries(event.target.value)}>
          {seriesOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          <option value={addAnotherSeries}>Add another series…</option>
        </select>
      </label>
      {series === addAnotherSeries ? (
        <label>
          New series name
          <span className="editorial-admin-hint">Use this only when a new recurring collection has been approved. We will add it to the customer’s standard list during onboarding.</span>
          <input name="series" required value={customSeries} onChange={(event) => setCustomSeries(event.target.value)} placeholder="e.g. Incident lessons" />
        </label>
      ) : <input name="series" type="hidden" value={series} />}

      <div className="editorial-admin-field">
        <span className="editorial-admin-field-label">Article body</span>
        <span className="editorial-admin-hint">Use the familiar toolbar to format the article. Your work is saved as safe Markdown; no HTML is needed.</span>
        <RichTextEditor value={bodyMarkdown} onChange={setBodyMarkdown} />
      </div>

      <section className="editorial-admin-assist" aria-labelledby="search-preview-heading">
        <div>
          <span className="eyebrow">Helpful defaults</span>
          <h2 id="search-preview-heading">Search preview</h2>
          <p>These are the title and description search engines may show. Start with a suggestion, then edit it in your own voice.</p>
        </div>
        <button className="editorial-admin-button editorial-admin-button-secondary" type="button" onClick={createStarterSeo}>Create starter SEO</button>
      </section>
      <div className="editorial-admin-form-grid">
        <label>
          Search-result title
          <span className="editorial-admin-hint">Usually the article title plus your site name; aim for about 60 characters.</span>
          <input ref={seoTitleRef} name="seoTitle" required defaultValue={entry?.seoTitle} />
        </label>
        <label>
          Search-result description
          <span className="editorial-admin-hint">A concise reason to read the article; aim for about 155 characters.</span>
          <textarea ref={seoDescriptionRef} name="seoDescription" required rows={3} defaultValue={entry?.seoDescription} />
        </label>
      </div>

      <section className="editorial-admin-canonical" aria-labelledby="original-source-heading">
        <span className="eyebrow">Publishing decision</span>
        <h2 id="original-source-heading">Where is the original source?</h2>
        <p>Search engines use this to avoid treating the same article on two sites as competing copies. For a new RBS article, choose “RBS is the original.” If the article already lives elsewhere, choose “Another site is the original” and add that URL. Leave it at “Decide later” while the draft is still being reviewed.</p>
        <label>
          Original-source decision
          <select name="canonicalMode" value={canonicalMode} onChange={(event) => setCanonicalMode(event.target.value as "local" | "external" | "owner-decision-required")}>
            <option value="owner-decision-required">Decide later</option>
            <option value="local">RBS is the original</option>
            <option value="external">Another site is the original</option>
          </select>
        </label>
        {canonicalMode === "external" ? (
          <label>
            Original article URL
            <span className="editorial-admin-hint">Use the full HTTPS address of the article that should receive search credit.</span>
            <input name="canonicalUrl" type="url" required placeholder="https://example.com/article" defaultValue={entry?.canonicalUrl} />
          </label>
        ) : <input name="canonicalUrl" type="hidden" value="" />}
      </section>

      <div className="editorial-admin-actions"><Link href={entry ? `/editorial/${entry.id}` : "/editorial"}>Cancel</Link><button className="editorial-admin-button" type="submit">{entry ? "Save draft changes" : "Save private draft"}</button></div>
    </form>
  );
}

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/gu, "-").replace(/(^-|-$)/gu, "");
}

function stripMarkdown(value: string): string {
  return value.replace(/[`*_>#\[\]()]/gu, " ").replace(/\s+/gu, " ").trim();
}

function trimAtWord(value: string, maximumLength: number): string {
  if (value.length <= maximumLength) return value;
  const candidate = value.slice(0, maximumLength - 1).replace(/\s+\S*$/u, "").trim();
  return `${candidate || value.slice(0, maximumLength - 1).trim()}…`;
}
