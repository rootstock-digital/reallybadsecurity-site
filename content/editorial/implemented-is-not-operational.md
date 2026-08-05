---
{
  "id": "rbs-security-0002",
  "title": "Implemented Is Not Operational",
  "slug": "implemented-is-not-operational",
  "summary": "Security work is not complete when a control exists; it is complete when ownership, evidence, and recovery are part of how the work is actually run.",
  "status": "published",
  "format": "commentary",
  "series": "operational-readiness",
  "authors": [{ "id": "really-bad-security", "name": "Really Bad Security" }],
  "publishedAt": "2026-08-02T00:00:00Z",
  "updatedAt": "2026-08-02T00:00:00Z",
  "image": {
    "src": "/media/security-signals/article-cover-template.png",
    "alt": "Notebook-paper editorial cover for Implemented Is Not Operational.",
    "decorative": false
  },
  "sources": [],
  "disclosures": [],
  "canonical": { "mode": "local" },
  "seo": {
    "title": "Implemented Is Not Operational | Really Bad Security",
    "description": "Implementation is not the finish line: security needs ownership, evidence, review, and recovery to become operational.",
    "noIndex": false
  }
}
---

## Implemented Is Not Operational

Security teams are very good at recognizing a visible change. A control was enabled. A platform was purchased. A policy was written. A dashboard went green. Those may all be useful events. None of them, by themselves, prove that the organization can operate the thing it just implemented.

Operational means someone can answer the ordinary questions without opening a scavenger hunt: who owns it, what evidence shows it still works, what changes when the team changes, and what happens when it fails at the least convenient moment.

## The implementation gap

The gap is rarely dramatic. It is a review that was supposed to recur but did not acquire an owner. It is an alert routed to a mailbox nobody monitors. It is access that was configured once and never revisited as roles changed. It is a backup or recovery path that exists on paper but has not been exercised safely.

That is not an argument against implementation. It is an argument against treating implementation as the finish line. A useful security control has a lifecycle after the launch announcement: ownership, evidence, review, change management, and an honest path for exceptions.

## What operating discipline looks like

For this article, the practical test is deliberately boring:

- Name the accountable owner, not merely the tool administrator.
- Define the evidence that confirms the control is still doing its intended job.
- Give recurring reviews a calendar, an input, and a decision-maker.
- Record the dependency a change could break before the change becomes urgent.
- Treat recovery and exception handling as part of the design, not as an embarrassing afterthought.

The list is not a universal framework, a compliance claim, or a substitute for product-specific guidance. It is a draft editorial lens for asking whether a control is lived in the organization or merely installed there.
