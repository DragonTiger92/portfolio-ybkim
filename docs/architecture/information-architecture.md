# Information Architecture

This document records the product information architecture and sitemap for the
static portfolio. It complements the [Content Model](content-model.md), which
defines the content types that fill these routes and sections.

This is the product sitemap, not the search-engine `sitemap.xml` artifact. XML
sitemap generation belongs with launch discovery metadata in `PBI-029` after the
canonical production URL exists.

## IA Goals

- Let recruiters understand fit, availability, and next actions quickly.
- Let engineering reviewers move from summary evidence to inspectable project
  detail without deep navigation.
- Keep the route model shallow enough for static Cloudflare Pages delivery.
- Keep public claims tied to public-safe evidence and repository artifacts.

## Sitemap

| Surface                    | URL or anchor       | Purpose                                           | Primary visitor question                            |
| -------------------------- | ------------------- | ------------------------------------------------- | --------------------------------------------------- |
| Landing page               | `/`                 | Main discovery surface for the whole portfolio    | Who is this developer and why should I continue?    |
| Intro                      | `/#intro`           | First-viewport positioning and primary actions    | Is the role fit clear within a few seconds?         |
| Project showcase           | `/#projects`        | Scannable evidence list with project entry points | Which project is most relevant to review first?     |
| Project detail             | `/projects/{slug}/` | First-depth case-study evidence                   | What did this project prove, and where is evidence? |
| Skills                     | `/#skills`          | Capability groups by delivery responsibility      | What strengths support the portfolio claims?        |
| Process                    | `/#process`         | Working style and quality signal                  | How does this developer approach delivery?          |
| Repository                 | `/#repository`      | Source, docs, and quality-gate inspection path    | Can I inspect how the project is managed?           |
| Repository/contact actions | External links      | Recruiter and reviewer next actions               | Where can I continue the conversation or review?    |

Section anchors are navigation waypoints, not independent page routes. Add a
new top-level route only when the content needs a durable page title,
description, shareable URL, or a substantially different review task.

## Route Rules

- Keep `/` as the only top-level discovery route unless a future phase accepts a
  concrete route-level need.
- Keep project details under `/projects/{slug}/` and generate them from the
  typed Astro content collection.
- Preserve static output and trailing slash behavior from the Astro
  configuration.
- Do not add `/about`, `/skills`, `/contact`, or `/resume` by default. Use
  anchors or external links until the content volume and sharing need justify a
  separate route.
- Select public contact and resume destinations in `PBI-006`; do not invent a
  placeholder route before the disclosure and rights boundaries are clear.
- Use the contact destinations selected in
  [Portfolio Content Source](../content/portfolio-content-source.md): main Gmail
  plus alias first, then Cloudflare-routed domain email after Phase 3 domain
  setup. This does not require a separate contact route.

## Post-launch Analytics Scope

Post-launch analytics should answer aggregate product questions, not identify
individual visitors:

- Which route or project detail receives sustained attention?
- Do visitors move from the landing page to project details?
- Which referrers or campaigns bring recruiter-like traffic?
- Which outbound actions, such as repository or contact links, are used?
- Are route-level performance signals consistent with the static-site quality
  expectations?

Avoid session replay, heatmaps, cross-site tracking, advertising audiences,
user-level profiles, or persistent identifiers unless a later product decision
documents a stronger need and the required consent and privacy controls.

## Analytics Tool Fit

Reference signals checked on 2026-07-01:

- [GA4 cookie usage](https://support.google.com/analytics/answer/11397207):
  GA4 JavaScript tags use first-party cookies to distinguish unique users and
  sessions.
- [Google Analytics data safeguards](https://support.google.com/analytics/answer/6004245):
  Google describes customer notice and consent responsibilities for cookies and
  identifiers.
- [Cloudflare Web Analytics data collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/):
  Cloudflare documents minimum performance-oriented collection and no tracking
  of individual end users across customer properties.
- [Cloudflare Pages setup](https://developers.cloudflare.com/web-analytics/get-started/#pages-projects):
  Cloudflare Pages can enable Web Analytics from the Pages project without a
  custom application server.
- [Plausible data policy](https://plausible.io/data-policy): Plausible documents
  cookie-less, aggregate analytics with no persistent identifiers.
- [Umami introduction](https://docs.umami.is/docs): Umami documents a
  privacy-focused analytics model and self-hosting option.

| Option                       | Fit for this portfolio                         | Notes                                                                  |
| ---------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| No visitor analytics         | Strongest privacy posture before public launch | Does not answer post-launch content-interest questions                 |
| Cloudflare Web Analytics     | Preferred initial candidate after PH-003       | Aligns with Cloudflare Pages and does not require a server component   |
| Plausible hosted             | Good privacy-focused candidate                 | Adds a paid SaaS account and external script decision                  |
| Umami hosted                 | Good privacy-focused candidate                 | Adds an external analytics account and script decision                 |
| Umami self-hosted            | Not a baseline fit                             | Requires server and database ownership beyond the static architecture  |
| Google Analytics 4           | Non-default candidate                          | Rich reports, but cookies and consent review add disproportionate cost |
| Custom server-side analytics | Not needed for the initial scope               | Would require a new architecture decision and operational ownership    |

Initial `PBI-015` implementation should prefer Cloudflare Web Analytics or a
similarly privacy-focused, cookie-less tool. Use Google Analytics only if a
specific post-launch question requires the GA ecosystem and the implementation
also documents consent, disclosure, retention, and data-sharing settings.

## Server Component Review

No server component is needed for the current sitemap or initial post-launch
analytics scope. A static page plus provider-managed aggregate analytics is
sufficient to review route and content interest.

Add an ADR and update deployment, operations, security, and requirement docs
before introducing any of the following:

- a Worker, API endpoint, backend collector, or analytics proxy;
- a database, queue, or private dashboard service;
- self-hosted analytics infrastructure;
- persistent visitor identifiers, advertising audiences, or consent-gated
  tracking flows; or
- a public URL structure change that promotes section anchors into routes.

## Feature Specification Review

Do not add a `docs/specifications/` document for this work yet. The sitemap,
requirements, PH-004 PBIs, and this architecture note are enough while analytics
is limited to provider selection, aggregate route metrics, outbound action
events, disclosure review, and a small review cadence.

Create a feature specification only if the future implementation spans multiple
PBIs, adds consent states, defines a custom event taxonomy, introduces a data
contract, or needs failure handling that cannot be understood from the backlog
and architecture docs.
