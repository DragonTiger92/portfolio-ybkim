# Project Content Inventory

This document is the pre-implementation content inventory for the portfolio.
It turns the content model and sitemap into implementation-ready planning data
before wireframes, mockups, or final product copy are created.

Implementation-ready project, contact, link, skill, and disclosure source data
is tracked in [Portfolio Content Source](portfolio-content-source.md).

It is not a design specification and it is not a private evidence store. Use it
to decide which projects, surfaces, links, and claims are eligible for the
public portfolio. Keep private source notes in owner-controlled storage outside
the public repository until the project owner approves a public-safe summary.

## Entity Decision

The portfolio does not need a spreadsheet-scale `SCREENS` entity yet. The
current product is one landing page, a first-depth project detail template, and
section anchors. Use this inventory as the planning entity for now:

- project inventory: candidate project data and publication boundaries;
- surface plan: landing sections, project detail template, and contact actions;
- link inventory: public destinations that may become product actions;
- private evidence intake: private source material that needs sanitization.

Create a separate `docs/specifications/` document only when a future feature
needs interaction states, validation flows, custom data contracts, or edge-case
handling that cannot be understood from this inventory, the content model, and
the backlog.

## Vocabulary

### Project Classification

| Classification        | Meaning                                                     |
| --------------------- | ----------------------------------------------------------- |
| Portfolio Product     | This portfolio product or its source repository             |
| Public Source Project | Project with a reviewable public repository                 |
| Professional Product  | Professional work that can be summarized publicly           |
| Private Evidence      | Applicant-only material that must not become public by copy |

### Link Disposition

| Disposition        | Meaning                                                     |
| ------------------ | ----------------------------------------------------------- |
| Public             | Safe to expose once the destination is rechecked            |
| Pending Owner Data | Needs the owner to provide or confirm the destination       |
| Private            | Do not expose in the portfolio                              |
| Not Applicable     | No useful or safe public destination for this project phase |

## Project Inventory

| Project Label                                                     | Classification        | Source Visibility | Product Link Disposition | Initial Detail Route | Candidate Tags                                                                                     | Phase 2 Public Treatment                                                                                                                         |
| ----------------------------------------------------------------- | --------------------- | ----------------- | ------------------------ | -------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `portfolio-ybkim`                                                 | Portfolio Product     | Public repository | Pending Pages deployment | Yes                  | Portfolio Product, Static Site Architecture, Documentation-Led Delivery, Quality Gates             | Primary case study and repository proof; expose source prominently as a secondary recruiter action                                               |
| `Karly`                                                           | Public Source Project | Public repository | Public                   | Yes                  | Public Source Project, Vanilla JavaScript, Semantic Markup, Team Delivery                          | Early frontend evidence with public source/demo links; selected owner-approved media may be used after exact-asset review                        |
| `Book-Kong`                                                       | Public Source Project | Public repository | Public                   | Yes                  | Public Source Project, React Application, Server-State UX, Team Leadership, Design-System Delivery | React and team-leadership evidence with public source/demo links; selected owner-created media may be used after exact-asset review              |
| Academy information and consultation web service                  | Professional Product  | Reviewed private  | Public                   | No                   | Professional Product, Full-Stack Delivery, API-Backed Form Flow, Release Preparation               | Professional highlight with public URL and generalized delivery copy; no private architecture or operations detail                               |
| Science-question concept and solution-logic structuring tool      | Professional Product  | Reviewed private  | Not Applicable           | No                   | Professional Frontend, Typed Boundaries, Server-State Queries, Handover Readiness                  | Professional highlight with verified owner-attributed frontend foundations; exclude later completed features                                     |
| Internal science education content production and review platform | Professional Product  | Reviewed private  | Private                  | No                   | Professional Operations, Maintenance Ownership, Django Operations, Documentation, Reliability      | Professional highlight with generalized reliability and inherited-system ownership; no source, private URL, workflows, screenshots, or internals |

## Initial Publication Set

The initial public portfolio should prioritize:

1. `portfolio-ybkim` as the main current project and source-code proof.
2. `Karly` as compact standards-aware Vanilla JavaScript evidence.
3. `Book-Kong` as compact React, server-state, and team-leadership evidence.

All six entries appear under one Projects section. Public-source work and
company-confidential business work remain separate subgroups so the IA stays
semantic without implying identical evidence. Private source, internal names,
private URLs, screenshots, credentials, endpoints, workflows, and confidential
architecture remain outside public copy.

## Surface Plan

| Surface                 | Content Payload                                                                     | Source Of Truth                                       | Related PBI                     | Readiness |
| ----------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------- | --------- |
| Intro                   | Positioning, current job-seeking status, primary review action                      | [Project Brief](../planning/project-brief.md)         | `PBI-004`, `PBI-021`            | Ready     |
| Project showcase        | Public-result cards plus company-project summaries, classifications, and safe links | This inventory and [Case Studies](case-studies.md)    | `PBI-005`, `PBI-022`            | Ready     |
| Project detail template | Problem, role, approach, result, stack, public evidence, next navigation            | Astro project collection schema and this inventory    | `PBI-022`                       | Ready     |
| Skills                  | Capability groups, not a long tool list                                             | [Content Model](../architecture/content-model.md)     | `PBI-007`                       | Ready     |
| Process                 | Planning, implementation, verification, documentation, and handover mindset         | Existing docs, ADRs, and public-safe summaries        | `PBI-007`, `PBI-022`            | Ready     |
| Contact and footer      | Contact: GitHub profile, email, resume; footer: profile and rights notice           | This inventory and owner-provided public destinations | `PBI-006`, `PBI-025`, `PBI-041` | Ready     |

## Link Inventory

| Link Entity                 | Destination                                        | Disposition | Placement Guidance                                                                    |
| --------------------------- | -------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| GitHub profile              | `https://github.com/DragonTiger92`                 | Public      | Hero secondary action, footer, or contact area                                        |
| Portfolio source repository | `https://github.com/DragonTiger92/portfolio-ybkim` | Public      | `portfolio-ybkim` project card and detail evidence only                               |
| `Karly` team repository     | `https://github.com/FRONTENDSCHOOL8/Karly`         | Public      | Project detail link after source and rights review                                    |
| `Karly` deployed demo       | `https://dragontiger92.github.io/Karly/`           | Public      | Public product link; do not publish demo credentials or private data                  |
| `Book-Kong` team repository | `https://github.com/FRONTENDSCHOOL8/Book-Kong`     | Public      | Project detail link after source and rights review                                    |
| `Book-Kong` deployed demo   | `https://bookong.netlify.app/`                     | Public      | Public product link; do not publish demo credentials or private data                  |
| Public owner email          | `dczwtu12b+portfolio@gmail.com`                    | Public      | Gmail web compose action plus a visible, copyable fallback; manage with Gmail filters |
| Resume PDF                  | `/assets/resume/yb-kim-resume.pdf`                 | Ready       | Public Korean resume download action                                                  |
| Academy product URL         | `https://academy.shine-edu.kr/`                    | Public      | Professional highlight and resume evidence; keep private operations detail out        |

## Private Evidence Intake

Use private evidence only to derive new public-safe copy. Do not copy source
text, recommendation-letter text, private project architecture, internal
workflows, endpoints, repository names, credentials, contact details, or
company-confidential material into public docs or website copy.

Before adding a professional project to the public portfolio, record:

- the public label to use instead of any private repository or internal system
  name;
- whether source code can be linked;
- whether a public product URL exists and should be linked;
- which claims are supported by public artifacts, resume material, or private
  evidence;
- which claims must be removed, generalized, or kept only for interview
  preparation;
- any third-party material, logo, screenshot, or generated asset that needs a
  license or rights review.

Current private evidence source categories:

| Source Material                         | Storage Boundary                 | Public Use Boundary                                                                   |
| --------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| Professional capacity and contribution  | Owner-controlled private context | Use for sanitized capability and project summaries; do not copy private detail        |
| Recommendation letter                   | Owner-controlled private context | Keep as applicant-only evidence; do not publish recommendation-letter contents        |
| Future professional project source docs | Owner-provided private workspace | Read only when requested; write public summaries from scratch after disclosure review |

## Contact Routing Decision

Use `dczwtu12b+portfolio@gmail.com` for the first public contact action. Manage
recruiter messages through Gmail filters and labels. Do not publish the base
Gmail address separately in this inventory.

Open the primary email action in a pre-addressed Gmail web compose view and
keep the portfolio email visible and copyable as a fallback with clear user
feedback. Do not rely on `mailto:` or an operating-system mail-client
association as the only contact path.

The owner selected the free Cloudflare-managed Pages hostname and does not plan
to purchase a domain. Keep `dczwtu12b+portfolio@gmail.com` as the public contact
and keep Cloudflare Email Routing, custom reply-from behavior, Google Workspace,
and another paid mailbox outside the portfolio baseline.

## Disclosure Review Timing

This inventory and [Portfolio Content Source](portfolio-content-source.md) make
Phase 2 wireframe and implementation planning possible, but professional and
private evidence still needs publication approval before it becomes public UI
copy, Astro content entries, screenshots, or downloadable assets.

The initial Phase 2 content freeze publishes generalized professional
highlights, but no private professional source, internal names, private URLs,
professional screenshots, recommendation-derived copy, or confidential
architecture. Karly and Book-Kong media can be selected when the exact asset is
cleared for privacy, attribution, and presentation context. The resume action
may appear in wireframes after `PBI-041` publishes the approved Korean PDF.

## Wireframe Input

The next wireframe or mockup task can start from these decisions:

- public-first project order: `portfolio-ybkim`, `Karly`, `Book-Kong`;
- source-repository actions scoped to the `portfolio-ybkim` project card and
  detail evidence;
- section model: intro, projects with public-result and company-confidential
  subgroups, skills with technology and capability evidence, contact/footer;
- project detail template available for public-source projects;
- Karly and Book-Kong media optional after exact-asset review;
- company projects included as generalized disclosure-safe cues inside the
  Projects section while private details remain excluded;
- implementation source data available in
  [Portfolio Content Source](portfolio-content-source.md).
