# Portfolio Content Source

This document is the implementation-ready content source for `PBI-040`. It sits
between the planning inventory and the Astro content entries. Use it when
drafting wireframes, project cards, project detail pages, contact actions, skill
sections, disclosure notes, and the resume download action. Resume-specific
boundaries are defined in
[Resume And Portfolio Boundary](resume-portfolio-boundary.md). Exact
first-viewport and public project showcase copy seeds are maintained in
[Landing Page Copy](landing-page-copy.md).

Keep this file public-safe. Private evidence may inform the rows below, but
private source text, private repository names, internal workflows, endpoints,
credentials, screenshots, and recommendation-letter contents must not be copied
into this document or the website.

## Source Policy

| Source Type                       | Public Use                                                             |
| --------------------------------- | ---------------------------------------------------------------------- |
| Public repository                 | Link and summarize after checking rights, secrets, and source scope    |
| Public product demo               | Link as public URL; do not publish demo credentials or private data    |
| Private professional evidence     | Use only to write fresh, generalized summaries after disclosure review |
| Resume or recommendation material | Keep applicant-only unless the owner approves a reviewed public asset  |
| Third-party assets                | Use only after license, attribution, and rights review                 |

## Project Source Data

| Project Slug      | Public Label                                                      | Publication Status | Primary Surface                 | Card Source Summary                                                                         | Detail Source Notes                                                                                                                                                                                                                      |
| ----------------- | ----------------------------------------------------------------- | ------------------ | ------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `portfolio-ybkim` | `portfolio-ybkim`                                                 | Ready              | Landing + detail                | Current portfolio product showing static architecture, documentation, and checks            | Emphasize owner role, Astro static delivery, docs-based planning, quality gates, and public repository review path                                                                                                                       |
| `karly`           | `Karly`                                                           | Ready              | Landing + detail                | Early Vanilla JavaScript team project with standards-aware UI work                          | Use product-list/detail, semantic-structure, CSS-variable, and team-work claims with public source/demo links; owner-approved design/media assets may be selected after exact-asset privacy and attribution review                       |
| `book-kong`       | `Book-Kong`                                                       | Ready              | Landing + detail                | Early React team project with component thinking, data flow, and team leadership            | Use team-leadership, server-state prefetch/query, Storybook utility, accessibility-helper, and public-link evidence; owner-created media/design assets may be selected after exact-asset privacy and attribution review                  |
| `academy-website` | Academy information and consultation web service                  | Ready              | Professional highlight + resume | Public service connecting academy information discovery with consultation intake            | Public URL and generalized planning-to-handover capability copy are approved; keep private architecture, internal handover detail, and operations detail out of portfolio copy                                                           |
| `domain-data-ui`  | Science-question concept and solution-logic structuring tool      | Ready              | Professional highlight + resume | Frontend foundations for structuring curriculum-aligned concepts and solution logic         | Attribute only owner-built authentication/session foundations, initial list and add/edit form structure, typed boundaries, server-state queries, and handoff; exclude later completed filter, mutation, persistence, and graph workflows |
| `operations-app`  | Internal science education content production and review platform | Ready              | Professional highlight + resume | Inherited internal work platform supporting science education content production and review | Use generalized transaction/concurrency care, secure file operations, rollback/recovery readiness, documentation, and inherited-system ownership without exposing private source, routes, screenshots, or internals                      |

Initial Phase 2 content has two layers. The project showcase renders the three
public-source detail projects. A separate professional highlights surface can
summarize the three professional products with public-safe labels and
owner-attributed claims, without exposing private source, internal names,
private URLs, credentials, endpoints, screenshots, or confidential architecture.

## Project Ordering

| Order | Project Slug      | Reason                                           |
| ----- | ----------------- | ------------------------------------------------ |
| 1     | `portfolio-ybkim` | Most current evidence and inspectable source     |
| 2     | `karly`           | Compact standards-aware Vanilla JavaScript proof |
| 3     | `book-kong`       | Compact React, data-flow, and leadership proof   |

Professional highlights are ordered separately after the public-source project
showcase:

1. Academy information and consultation web service.
2. Science-question concept and solution-logic structuring tool.
3. Internal science education content production and review platform.

## Link Source Data

| Link Entity                 | Destination                                        | Status           | Product Use                                                                                       |
| --------------------------- | -------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| GitHub profile              | `https://github.com/DragonTiger92`                 | Ready            | Hero secondary action and footer/contact action; use for every broad `GitHub` label               |
| Portfolio source repository | `https://github.com/DragonTiger92/portfolio-ybkim` | Ready            | `portfolio-ybkim` project card and detail evidence only                                           |
| Portfolio production URL    | Phase 3 decision                                   | Deferred         | Do not invent before deployment architecture selects the production URL                           |
| `Karly` team repository     | `https://github.com/FRONTENDSCHOOL8/Karly`         | Ready            | Public project detail link after source and rights review                                         |
| `Karly` deployed demo       | `https://dragontiger92.github.io/Karly/`           | Public           | Public product link; keep any demo credentials out of portfolio copy                              |
| `Karly` design reference    | Owner-provided public Figma URL                    | Ready            | Owner-approved read-only design reference; use exact assets only after attribution/privacy review |
| `Book-Kong` team repository | `https://github.com/FRONTENDSCHOOL8/Book-Kong`     | Ready            | Public project detail link after source and rights review                                         |
| `Book-Kong` deployed demo   | `https://bookong.netlify.app/`                     | Public           | Public product link; keep any demo credentials out of portfolio copy                              |
| Public email                | `dczwtu12b+portfolio@gmail.com`                    | Ready            | Gmail web compose action plus a visible, copyable fallback; manage with Gmail filters and labels  |
| Custom domain contact email | Phase 3 Cloudflare-routed address                  | Phase 3 Decision | `PBI-049`; route to the verified portfolio Gmail destination before publication                   |
| Resume PDF                  | `/assets/resume/yb-kim-resume.pdf`                 | Ready            | Public Korean resume download after `PBI-041` final export                                        |
| Academy product URL         | `https://academy.shine-edu.kr/`                    | Public           | Professional highlight and resume evidence; keep private operations detail out of portfolio copy  |

GitHub `noreply` addresses are privacy and commit-attribution addresses, not a
recruiter contact channel. The initial public contact email is
`dczwtu12b+portfolio@gmail.com`, managed with Gmail filters and labels. After
the Phase 3 domain decision, create a Cloudflare Email Routing address such as
`contact@{production-domain}` or `hello@{production-domain}` on the Free plan
and forward it to `dczwtu12b+portfolio@gmail.com`. Verify the destination and
test delivery from another account before replacing the public contact action.
Keep the existing Gmail contact as the fallback. Do not add paid Google
Workspace or custom reply-from configuration unless a later product decision
accepts that extra cost and operational scope.

For the initial static contact experience, open a pre-addressed Gmail web
compose view in a new browser context and keep the portfolio email visible and
copyable with clear feedback. Do not rely on `mailto:` or an operating-system
mail-client association as the only contact path.

## Contact Source Data

| Contact Action     | Implementation Readiness | Copy Direction                                     | Notes                                                                         |
| ------------------ | ------------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------- |
| GitHub profile     | Ready                    | Continue the review or conversation through GitHub | Every broad `GitHub` label points to the owner profile                        |
| Gmail compose      | Ready                    | Write an email in Gmail                            | Open a pre-addressed Gmail web compose view in a new browser context          |
| Email address copy | Ready                    | Copy the portfolio email                           | Keep the address visible and copyable and announce clear interaction feedback |
| Domain email       | Phase 3 Decision         | Contact for opportunities                          | Use Cloudflare Email Routing for receiving only after production domain setup |
| Resume PDF         | Ready                    | Download Korean resume                             | Link `/assets/resume/yb-kim-resume.pdf` after the public asset exists         |

## Resume Source Data

Use the old resume only as private reference material. It contains stale
positioning and personal data that should not be copied into the public
downloadable resume.

| Area            | Public Resume Decision                                                                 |
| --------------- | -------------------------------------------------------------------------------------- |
| Role label      | Use `Web Developer`; present frontend strength first and adjacent full-stack coverage  |
| Language        | Maintain Korean primary resume and English companion draft                             |
| Contact email   | Use `dczwtu12b+portfolio@gmail.com` until Phase 3 domain email routing is ready        |
| Phone           | Omit from the public downloadable resume; provide later only through application flows |
| Home address    | Omit from the public downloadable resume                                               |
| Location        | Use owner-approved city/district-level location only                                   |
| Reason leaving  | Omit from the public resume body; prepare for application forms or interviews          |
| Employer        | `주식회사 룰메이커스` is approved for the public resume; use `Rulemakers` in English   |
| Portfolio URL   | Add after Phase 3 production URL decision                                              |
| GitHub          | Include `https://github.com/DragonTiger92`                                             |
| Editable source | Keep draft DOCX under private `.contexts/` until owner approval                        |
| Public PDF path | Publish reviewed PDF at `/assets/resume/yb-kim-resume.pdf`                             |

Resume content should summarize current fit, recent professional experience,
selected public projects, grouped skills, and education or credentials that
still support the target role. Portfolio project pages should carry the deeper
case-study detail so the resume stays concise.

## Skill Source Data

| Skill Group             | Public Copy Direction                                                                   | Evidence Boundary                                                     |
| ----------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Frontend implementation | Semantic UI, TypeScript, CSS, React/Next.js experience, accessibility-aware structure   | Public projects plus generalized professional evidence                |
| Product delivery        | Scope control, planning, documentation, team coordination, and reviewable handover      | Public docs, team projects, and sanitized professional evidence       |
| Integration literacy    | API concepts, typed boundaries, server-state UX, validation, and data-flow clarity      | Public-source examples plus private evidence generalized after review |
| Deployment literacy     | Static hosting, build artifacts, Docker/cloud exposure, release and operations thinking | Public repository plus applicant-only professional evidence           |
| Maintenance mindset     | Readable structure, quality gates, reliability, documentation, and inherited-code care  | Public repo governance plus sanitized private operations evidence     |

Avoid publishing a long proficiency-ranked tool list. The implementation should
lead with responsibility-centered capability groups and use tools only as
supporting proof.

## Disclosure Source Data

| Content Area                 | Public Rule                                                                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Professional project labels  | Use generic public labels unless the owner approves exact names                                                                                                          |
| Company and internal systems | Employer name is approved for the resume; keep internal system names, repository paths, architecture, private URLs, and endpoints out                                    |
| Auth, workflow, and data     | Generalize authentication, workflow, domain model, database, and operational details                                                                                     |
| Recommendation letter        | Do not publish or quote; keep as applicant-only supporting material                                                                                                      |
| Demo credentials             | Do not publish credentials or reusable delivery links; expose only the reviewed request path and use a password-protected expiring link with a separate password channel |
| Screenshots and media        | Karly and Book-Kong media/design assets are owner-approved for portfolio use; still check exact assets for private data, attribution, and presentation context           |
| Resume                       | Publish only a reviewed PDF following the resume/portfolio boundary                                                                                                      |

## Disclosure Review Timing

`PBI-040` made the content source implementation-ready. `PBI-045` resolves the
initial Phase 2 disclosure scope through publication decisions or explicit
deferral. Reopen the affected review before adding private source detail,
professional screenshots, a new resume asset, recommendation-derived copy, or a
claim outside the map below.

## Disclosure Review Resolution

| Review Area                                                       | Resolution                                                              | Initial Phase 2 Outcome                                                                              |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Resume PDF                                                        | Publish the approved Korean PDF after `PBI-041` final export            | Use the live download action at `/assets/resume/yb-kim-resume.pdf`                                   |
| `Karly` public project                                            | Confirm text claims, public links, and owner-approved media eligibility | Project card/detail copy, public repository link, deployed demo link, and selected media if reviewed |
| `Book-Kong` public project                                        | Confirm text claims, public links, and owner-approved media eligibility | Project card/detail copy, public repository link, deployed demo link, and selected media if reviewed |
| Academy information and consultation web service                  | Publish a generalized professional highlight and public URL             | Professional highlight surface plus resume evidence; route/detail expansion remains optional         |
| Science-question concept and solution-logic structuring tool      | Publish a generalized professional highlight                            | Use only verified owner-attributed frontend foundations and handoff language                         |
| Internal science education content production and review platform | Publish a generalized professional highlight                            | Use only verified generalized operations, reliability, and documentation language                    |
| Recommendation letter                                             | Keep applicant-only; do not quote, paraphrase, or upload it             | No public website content; may inform private resume/interview preparation                           |
| Screenshots and media                                             | Karly and Book-Kong assets are eligible after exact-asset review        | Use selected public-project media when it contains no private data and attribution is clear          |
| Portfolio claims                                                  | Use the claim-evidence map below                                        | Publish only mapped public-safe claims                                                               |

## Disclosure Decision Ledger

| Review Area                                                       | Decision                                         | Public Source Outcome                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Resume PDF                                                        | Publish Korean asset                             | Final Korean PDF is the public resume asset; English companion remains application-only                         |
| `Karly` public project                                            | Publish text, links, and selected reviewed media | Use verified owner contribution text, public repo/demo links, and owner-approved media after exact-asset review |
| `Book-Kong` public project                                        | Publish text, links, and selected reviewed media | Use verified owner contribution text, public repo/demo links, and owner-created media after exact-asset review  |
| Academy information and consultation web service                  | Publish generalized highlight                    | Use its public URL and generalized product claim in the professional highlight surface and resume               |
| Science-question concept and solution-logic structuring tool      | Publish generalized highlight                    | Use only verified owner-attributed frontend foundations and handoff language                                    |
| Internal science education content production and review platform | Publish generalized highlight                    | Use only generalized reliability, recovery, documentation, and inherited-system language                        |
| Recommendation letter                                             | Resume or interview only                         | Do not upload, quote, or paraphrase letter contents on the public website                                       |
| Screenshots and media                                             | Exact-asset review                               | Karly and Book-Kong assets are eligible; professional screenshots remain deferred until separately approved     |
| Portfolio claims                                                  | Publish mapped claims                            | Publish only claims in the claim-evidence map below; keep private evidence generalized                          |

Private claim-level notes live in
`.contexts/portfolio-evidence/disclosure-review-working-notes.md`.

## Claim-Evidence Map

| Public Claim Direction                                                                                            | Evidence Class                                                              | Phase 2 Decision               | Boundary                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `portfolio-ybkim` uses static Astro architecture and documentation-led delivery                                   | Public source, docs, ADRs, and checks                                       | Publish                        | Link the repository and let detail copy point to inspectable artifacts                                       |
| `portfolio-ybkim` tracks 10 ADRs and more than 40 PBIs                                                            | Public repository count verified 2026-07-09                                 | Publish                        | Keep the stable `40+` wording rather than coupling copy to every new backlog item                            |
| Karly owner work covers product-list/detail UI, semantic structure, and CSS variables                             | Public README, Git history, source, and owner-approved design/media context | Publish project detail         | Do not publish demo credentials; selected media still needs exact-asset privacy and attribution review       |
| Book-Kong owner work covers team leadership, query/prefetch flows, Storybook utilities, and accessibility helpers | Public README, Git history, source, and owner-created design/media context  | Publish project detail         | Do not repeat public demo credentials; selected media still needs exact-asset privacy and attribution review |
| Academy work connects planning, UI, API/data work, release preparation, and handoff                               | Reviewed private evidence and public URL                                    | Publish professional highlight | Keep architecture, internal workflow, source, and operations details private                                 |
| Professional domain-data work demonstrates frontend foundations and handoff                                       | Reviewed private commit attribution                                         | Publish professional highlight | Exclude later completed filtering, mutations, persistence, backend, and production graph work                |
| Professional operations work demonstrates inherited-system reliability and documentation                          | Reviewed private evidence                                                   | Publish professional highlight | Generalize implementation details; expose no private routes, screenshots, counts, or failure modes           |
| Frontend-specialized web developer with adjacent full-stack and operations coverage                               | Combined public and reviewed private evidence                               | Publish positioning            | Lead with frontend; use adjacent capabilities as supporting scope rather than named private cases            |

Claims outside this map remain deferred until a public artifact or reviewed
private support is recorded with an explicit publication boundary.

## Phase 2 Content Freeze

The initial Phase 2 content input is frozen as follows:

- Render three public-source project detail entries in this order:
  `portfolio-ybkim`, `Karly`, `Book-Kong`.
- Add a separate professional highlights surface for the academy service, the
  concept and solution-logic structuring tool, and the internal production and
  review platform. Keep these summaries generalized and disclosure-safe.
- Give every professional highlight the visible `실무 경험 · 공개 범위 요약`
  cue so it cannot be mistaken for an inspectable public-source case study.
- Use public project cards and details with approved public repositories and
  demos. Karly and Book-Kong media/design assets may be used if the exact asset
  passes privacy, attribution, and presentation-context review.
- Use the grouped skill directions in this document without proficiency scores.
- Use the GitHub profile, Gmail web compose, and the visible, copyable portfolio
  email as ready profile/contact actions. Keep repository links scoped to the
  corresponding public project card and detail evidence.
- Use the Korean resume download path once `PBI-041` publishes the approved PDF.
- Keep the English resume application-only for the initial Korean portfolio.
  Reconsider a public companion asset with the English portfolio work or an
  explicit owner decision.
- Do not expose private professional source, internal names, private URLs,
  credentials, endpoints, workflows, screenshots, or confidential architecture.
- Defer the production URL and custom-domain email to Phase 3.

These deferrals are part of the freeze, not missing placeholder values. A later
scope change should reopen the affected disclosure row before implementation
copy or assets change.

## Wireframe Input

- Use the public project order from this document.
- Render the three public-source project details and a professional highlights
  section with generalized claims. Give each professional highlight the visible
  `실무 경험 · 공개 범위 요약` scope cue.
- Use selected Karly and Book-Kong media only after exact-asset review; keep
  professional screenshots and private media out of the first implementation.
- Treat the GitHub profile as the destination for broad `GitHub` actions.
- Treat each public repository as project-scoped review evidence, with the
  `portfolio-ybkim` source linked only from its project card and detail.
- Treat a Gmail web compose action plus the visible, copyable
  `dczwtu12b+portfolio@gmail.com` address as the interim public contact.
- Use `/assets/resume/yb-kim-resume.pdf` as the resume asset path after
  `PBI-041` final export.
- Keep the production URL deferred to Phase 3. Treat an academy detail route as
  optional later scope; the initial surface can link the public product URL from
  the professional highlight.
- Do not create a separate `/resume` route or contact route for the first
  implementation; use existing anchors and external links.
