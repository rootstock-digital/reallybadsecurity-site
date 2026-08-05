# Security Signals cover system

**Status:** approved RBS editorial-preview visual standard.

## Purpose

Security Signals use one shared, reusable notebook-paper background. The website renders each article title as accessible HTML over that background. This keeps every preview image in the same 16:9 frame, prevents title artwork from drifting, and makes new articles fast to prepare.

## Master layout

- **Master:** 1280 × 720 px (16:9), matching the YouTube thumbnail standard.
- **Background:** use `public/media/security-signals/article-cover-template.png`.
- **Title:** one centered, all-caps article title, rendered by the website in the image safe area.
- **No embedded labels:** do not add a series name, identifier, kicker, date, subtitle, badge, or logo to the cover.
- **Card frame:** the article and YouTube preview cards share the same image frame. Do not change the 16:9 ratio or create a one-off card height.
- **Description:** preview summaries are deliberately clamped so card content cannot distort the shared frame.

## Palette and texture

| Role | Value | Use |
| --- | --- | --- |
| Navy | `#0D1B2A` | title text and editorial structure |
| Warm off-white | `#F5F0E8` | paper field |
| Orange | `#E8621A` | restrained edge accents |
| Muted blue-gray | `#8BA3B8` | grid and support detail |

The shared background may retain a quiet notebook grid, torn-paper edge, and restrained navy/orange detail. It must keep the center clear for the title and must never contain literal security graphics, fake interface language, stock photography, badges, or baked-in text.

## Canva handoff and author workflow

1. Create or duplicate a **1280 × 720** Canva design using the shared notebook-paper background.
2. Keep the center clear for a bold, centered, all-caps title with generous space around it.
3. Do not add a category, series name, date, subtitle, logo, or other repeated label.
4. For the RBS website, use the shared background asset and let the site render the title automatically.
5. Use a Canva-exported title treatment only when a separate social asset requires it; it must preserve the same 16:9 canvas and title-safe area.
6. Keep meaningful alt text in editorial frontmatter. The article title, summary, date, and link must remain HTML text.

## Relationship to preview panels

The RBS home page intentionally reverses the inner-panel color treatment between the two modules: Security Signals remains on the warm off-white section with blue series panels, while Podcasts remains on the blue section with warm off-white series panels. That is an RBS brand rule, not a general Starter requirement.
