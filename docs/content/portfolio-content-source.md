# Portfolio Content Source

This document is the implementation-ready content source for `PBI-040`. It sits
between the planning inventory and the Astro content entries. Use it when
drafting wireframes, project cards, project detail pages, contact actions, skill
sections, disclosure notes, and the resume download action. Resume-specific
boundaries are defined in
[Resume And Portfolio Boundary](resume-portfolio-boundary.md).

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

| Project Slug      | Public Label                     | Publication Status | Primary Surface  | Card Source Summary                                                              | Detail Source Notes                                                                                                                                           |
| ----------------- | -------------------------------- | ------------------ | ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `portfolio-ybkim` | `portfolio-ybkim`                | Ready              | Landing + detail | Current portfolio product showing static architecture, documentation, and checks | Emphasize owner role, Astro static delivery, docs-based planning, quality gates, and public repository review path                                            |
| `karly`           | `Karly`                          | Ready              | Landing + detail | Early Vanilla JavaScript team project with standards-aware UI work               | Emphasize product-list/detail work, semantic markup habits, team delivery, and public source/demo links after review                                          |
| `book-kong`       | `Book-Kong`                      | Ready              | Landing + detail | Early React team project with component thinking, data flow, and team leadership | Emphasize team lead role, React category project work, server-state UX, design-system thinking, and public links                                              |
| `academy-website` | Academy consultation website     | URL Confirmed      | Deferred cue     | Professional public-facing product from planning through release preparation     | Public URL is owner-confirmed; add copy only after disclosure review and generalize planning, responsive UI, API-backed intake flow, deployment, and handover |
| `domain-data-ui`  | Professional domain-data UI      | Private Draft      | Deferred cue     | Professional authenticated frontend for complex domain data review and editing   | Use only after disclosure review; generalize typed API boundaries, state management, validation, and complex interactions                                     |
| `operations-app`  | Professional operations platform | Private Draft      | Deferred cue     | Professional maintenance and operations work on an inherited internal platform   | Use only after disclosure review; generalize reliability, documentation, operational care, and inherited-system ownership                                     |

Initial public implementation should render only the three Ready projects. The
Academy URL is public and owner-confirmed, but the project should not create a
public route or project card until disclosure-reviewed copy is approved. The
remaining Private Draft projects are source data for design direction, resume
alignment, and future disclosure-reviewed copy; they should not create public
routes or links yet.

## Project Ordering

| Order | Project Slug      | Reason                                           |
| ----- | ----------------- | ------------------------------------------------ |
| 1     | `portfolio-ybkim` | Most current evidence and inspectable source     |
| 2     | `karly`           | Compact standards-aware Vanilla JavaScript proof |
| 3     | `book-kong`       | Compact React, data-flow, and leadership proof   |

Private Draft projects may influence positioning and skill copy, but they do
not enter the public ordering until the owner approves public labels, claims,
links, and disclosure scope.

## Link Source Data

| Link Entity                 | Destination                                        | Status           | Product Use                                                                                      |
| --------------------------- | -------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------ |
| GitHub profile              | `https://github.com/DragonTiger92`                 | Ready            | Primary public contact fallback and footer/header action                                         |
| Portfolio source repository | `https://github.com/DragonTiger92/portfolio-ybkim` | Ready            | Hero secondary action, repository section, project detail, and footer                            |
| Portfolio production URL    | Phase 3 decision                                   | Deferred         | Do not invent before deployment architecture selects the production URL                          |
| `Karly` team repository     | `https://github.com/FRONTENDSCHOOL8/Karly`         | Ready            | Public project detail link after source and rights review                                        |
| `Karly` deployed demo       | `https://dragontiger92.github.io/Karly/`           | Public           | Public product link; keep any demo credentials out of portfolio copy                             |
| `Book-Kong` team repository | `https://github.com/FRONTENDSCHOOL8/Book-Kong`     | Ready            | Public project detail link after source and rights review                                        |
| `Book-Kong` deployed demo   | `https://bookong.netlify.app/`                     | Public           | Public product link; keep any demo credentials out of portfolio copy                             |
| Public email                | `dczwtu12b+portfolio@gmail.com`                    | Ready            | Interim recruiter contact; manage with Gmail filters and labels                                  |
| Custom domain contact email | Phase 3 Cloudflare-routed address                  | Phase 3 Decision | Route incoming mail to Gmail on the Cloudflare Free plan; do not reconfigure reply-from behavior |
| Resume PDF                  | `/assets/resume/yb-kim-resume.pdf`                 | Path Decided     | Publish after the PDF content and personal-data disclosure review                                |
| Academy product URL         | `https://academy.shine-edu.kr/`                    | Public           | Public product link; use in portfolio only after disclosure scope review                         |

GitHub `noreply` addresses are privacy and commit-attribution addresses, not a
recruiter contact channel. The initial public contact email is
`dczwtu12b+portfolio@gmail.com`, managed with Gmail filters and labels. After
the Phase 3 domain decision, create a Cloudflare Email Routing address such as
`contact@{production-domain}` or `hello@{production-domain}` on the Free plan
and forward it to the existing Gmail inbox. Do not add paid Google Workspace or
custom reply-from configuration unless a later product decision accepts that
extra cost and operational scope.

## Contact Source Data

| Contact Action | Implementation Readiness | Copy Direction                                      | Notes                                                                         |
| -------------- | ------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| GitHub profile | Ready                    | Continue the review or conversation through GitHub  | Public and already tied to inspectable work                                   |
| Repository     | Ready                    | Review source, docs, ADRs, and quality-gate history | Use as technical reviewer action, not the only contact path                   |
| Email          | Ready                    | Contact for opportunities                           | Use `dczwtu12b+portfolio@gmail.com` with filter/label management              |
| Domain email   | Phase 3 Decision         | Contact for opportunities                           | Use Cloudflare Email Routing for receiving only after production domain setup |
| Resume PDF     | Path Decided             | Download resume                                     | Use `/assets/resume/yb-kim-resume.pdf` after PDF disclosure review            |

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

| Content Area                 | Public Rule                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| Professional project labels  | Use generic public labels unless the owner approves exact names                         |
| Company and internal systems | Do not publish company names, internal system names, repository paths, or endpoints     |
| Auth, workflow, and data     | Generalize authentication, workflow, domain model, database, and operational details    |
| Recommendation letter        | Do not publish or quote; keep as applicant-only supporting material                     |
| Demo credentials             | Do not publish credentials from earlier project notes or screenshots                    |
| Screenshots and media        | Use only after checking private data, third-party rights, attribution, and asset policy |
| Resume                       | Publish only a reviewed PDF following the resume/portfolio boundary                     |

## Disclosure Review Timing

`PBI-040` makes the content source implementation-ready, but it is not the final
publication approval for private or professional evidence. Run disclosure review
before Phase 2 implementation turns any of these into public UI copy, Astro
content entries, screenshots, or downloadable assets:

- academy project card, project detail, or professional-experience cue;
- domain-data UI or operations platform claims;
- resume PDF contents and exposed personal data;
- screenshots, media, third-party logos, or product artifacts;
- any claim derived from recommendation-letter or private employer evidence.

Wireframe construction may start before that review only when it uses the Ready
public-source projects, public links, selected contact actions, and generic
professional placeholders. If Phase 2 scope includes publishing Academy or other
professional evidence, schedule disclosure review as the first Phase 2 content
checkpoint before implementation.

## Disclosure Review Queue

| Review Area                  | Decision Needed                                                                  | Publishable After Approval                                                        |
| ---------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Resume PDF                   | Confirm the exact PDF content, personal data, contact details, and rights scope  | `/assets/resume/yb-kim-resume.pdf` download action                                |
| `Karly` public project       | Check public repo/demo rights, no credential publication, role claims, and media | Project card/detail copy, public repo link, deployed demo link                    |
| `Book-Kong` public project   | Check public repo/demo rights, no credential publication, role claims, and media | Project card/detail copy, public repo link, deployed demo link                    |
| Academy consultation website | Decide whether it appears as a card, detail, professional cue, or resume-only    | Public URL and generalized product summary without private backend or ops detail  |
| Professional domain-data UI  | Decide whether any public cue is useful without exposing internal workflow/data  | Generalized frontend architecture and complex-interaction claim only              |
| Operations platform          | Decide whether any public cue is useful without exposing internal operations     | Generalized maintenance, reliability, documentation, and inherited-system claim   |
| Recommendation letter        | Confirm it remains applicant-only and is not quoted or uploaded                  | No public website content; may inform private resume/interview preparation        |
| Screenshots and media        | Check private data, third-party rights, logos, screenshots, and attribution      | Only reviewed public screenshots, media, or generated assets with clear rights    |
| Portfolio claims             | Map each strong claim to public artifacts or disclosure-reviewed private support | Public copy that is specific enough to be credible without exposing private facts |

Default decision before review: publish the three Ready public-source projects,
public links, selected contact email, repository review path, and generic skill
groups. Keep Academy and other professional evidence as placeholders or
resume/interview support until the relevant rows above are approved.

## Disclosure Decision Ledger

| Review Area                  | Decision                 | Public Source Outcome                                                                  |
| ---------------------------- | ------------------------ | -------------------------------------------------------------------------------------- |
| Resume PDF                   | Needs revision           | Use path only; create a refreshed public resume before publishing the PDF              |
| `Karly` public project       | Publish                  | Use current text, public repo link, and deployed demo link; review media separately    |
| `Book-Kong` public project   | Publish                  | Use current text, public repo link, and deployed demo link; review media separately    |
| Academy consultation website | Generalize               | Public URL is safe; page copy/media need review before reuse                           |
| Professional domain-data UI  | Generalize               | Use only as generalized frontend/domain-data UI evidence, not as a named case study    |
| Operations platform          | Generalize               | Use only as generalized maintenance/reliability evidence, not as a named case study    |
| Recommendation letter        | Resume or interview only | Do not upload, quote, or paraphrase letter contents on the public website              |
| Screenshots and media        | Needs owner review       | Use only reviewed assets with clean private-data, third-party rights, and attribution  |
| Portfolio claims             | Mixed                    | Public-source claims may publish; private-evidence-backed claims must stay generalized |

Private claim-level notes live in
`.contexts/portfolio-evidence/disclosure-review-working-notes.md`.

## Wireframe Input

- Use the public project order from this document.
- Render public-source projects first; represent professional evidence only as
  generalized positioning until disclosure review is complete.
- Treat GitHub profile and repository links as ready contact/review actions.
- Treat `dczwtu12b+portfolio@gmail.com` as the interim public contact.
- Use `/assets/resume/yb-kim-resume.pdf` as the resume asset path, but publish
  the file only after resume disclosure review and the boundary checklist in
  [Resume And Portfolio Boundary](resume-portfolio-boundary.md).
- Keep production URL and academy project route deferred.
- Do not create a separate `/resume` route or contact route for the first
  implementation; use existing anchors and external links.
