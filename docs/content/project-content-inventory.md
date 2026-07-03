# Project Content Inventory

This document is the pre-implementation content inventory for the portfolio.
It turns the content model and sitemap into implementation-ready planning data
before wireframes, mockups, or final product copy are created.

It is not a design specification and it is not a private evidence store. Use it
to decide which projects, surfaces, links, and claims are eligible for the
public portfolio. Keep private source notes in `.contexts/` or `tmp/` until the
project owner approves a public-safe summary.

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

| Project Label               | Classification        | Source Visibility | Product Link Disposition | Detail Route | Candidate Tags                                                                                     | Public Treatment                                                                                      |
| --------------------------- | --------------------- | ----------------- | ------------------------ | ------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `portfolio-ybkim`           | Portfolio Product     | Public repository | Pending production URL   | Yes          | Portfolio Product, Static Site Architecture, Documentation-Led Delivery, Quality Gates             | Primary case study and repository proof; expose source prominently as a secondary recruiter action    |
| `Karly`                     | Public Source Project | Public repository | Public                   | Yes          | Public Source Project, Vanilla JavaScript, Semantic Markup, Team Delivery                          | Compact early frontend evidence; link public source and deployed demo after destination review        |
| `Book-Kong`                 | Public Source Project | Public repository | Public                   | Yes          | Public Source Project, React Application, Server-State UX, Team Leadership, Design-System Delivery | Compact early React evidence; link public source and deployed demo after destination review           |
| Academy landing product     | Professional Product  | Private source    | Pending Owner Data       | Candidate    | Professional Product, Full-Stack Delivery, Next.js Product, API-Backed Form Flow, Production Setup | Candidate public product summary; use product URL only after owner supplies the public landing URL    |
| Professional domain-data UI | Private Evidence      | Private source    | Not Applicable           | Candidate    | Professional Frontend, Domain Data UI, Next.js Architecture, API Integration, Handover Readiness   | Use only after disclosure review; summarize behavior and ownership without internal data or URLs      |
| Professional operations app | Private Evidence      | Private source    | Private                  | Candidate    | Professional Operations, Maintenance Ownership, Django Operations, Documentation, Reliability      | Use only as sanitized experience evidence; do not expose source, private URL, workflows, or internals |

## Initial Publication Set

The initial public portfolio should prioritize:

1. `portfolio-ybkim` as the main current project and source-code proof.
2. `Karly` as compact standards-aware Vanilla JavaScript evidence.
3. `Book-Kong` as compact React, server-state, and team-leadership evidence.

The professional projects should remain in private preparation until the owner
provides source context, public URL confirmation where applicable, and approval
for a sanitized summary. They should not block the first wireframe.

## Surface Plan

| Surface                  | Content Payload                                                                 | Source Of Truth                                       | Related PBI          | Readiness |
| ------------------------ | ------------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------- | --------- |
| Intro                    | Positioning, current job-seeking status, primary review action                  | [Project Brief](../planning/project-brief.md)         | `PBI-004`, `PBI-021` | Ready     |
| Project showcase         | Ordered project cards, project classifications, short summaries, safe links     | This inventory and [Case Studies](case-studies.md)    | `PBI-005`, `PBI-022` | Ready     |
| Project detail template  | Problem, role, approach, result, stack, public evidence, next navigation        | Astro project collection schema and this inventory    | `PBI-022`            | Ready     |
| Skills                   | Capability groups, not a long tool list                                         | [Content Model](../architecture/content-model.md)     | `PBI-007`            | Ready     |
| Process                  | Planning, implementation, verification, documentation, and handover mindset     | Existing docs, ADRs, and public-safe summaries        | `PBI-007`, `PBI-022` | Ready     |
| Repository               | Link to this repository, docs, ADRs, and quality-gate review path               | [Content Model](../architecture/content-model.md)     | `PBI-006`            | Ready     |
| Contact and footer       | GitHub profile, repository source, owner email, resume PDF, rights notice       | This inventory and owner-provided public destinations | `PBI-006`, `PBI-025` | Partial   |
| Professional project cue | Optional hint that additional professional evidence exists on request or resume | Private context after disclosure review               | `PBI-022`            | Deferred  |

## Link Inventory

| Link Entity                 | Destination                                        | Disposition        | Placement Guidance                                                                  |
| --------------------------- | -------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| GitHub profile              | `https://github.com/DragonTiger92`                 | Public             | Header, footer, or contact section                                                  |
| Portfolio source repository | `https://github.com/DragonTiger92/portfolio-ybkim` | Public             | Hero secondary action, repository section, and footer                               |
| `Karly` team repository     | `https://github.com/FRONTENDSCHOOL8/Karly`         | Public             | Project detail link after source and rights review                                  |
| `Karly` deployed demo       | `https://dragontiger92.github.io/Karly/`           | Public             | Project detail link after checking that demo credentials or private data are absent |
| `Book-Kong` team repository | `https://github.com/FRONTENDSCHOOL8/Book-Kong`     | Public             | Project detail link after source and rights review                                  |
| `Book-Kong` deployed demo   | `https://bookong.netlify.app/`                     | Public             | Project detail link after checking demo account and third-party data boundaries     |
| Public owner email          | Owner-provided address                             | Pending Owner Data | Contact action and footer after confirmation                                        |
| Resume PDF                  | Owner-provided public asset path                   | Pending Owner Data | Contact action after resume PDF is disclosure-reviewed and licensed appropriately   |
| Academy landing product URL | Owner-provided public URL                          | Pending Owner Data | Project detail or project card only after owner confirms the exact public URL       |

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

| Source Material                         | Storage Boundary                         | Public Use Boundary                                                                   |
| --------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| Professional capacity and contribution  | Gitignored owner-provided source context | Use for sanitized capability and project summaries; do not copy private detail        |
| Recommendation letter                   | Gitignored owner-provided source context | Keep as applicant-only evidence; do not publish recommendation-letter contents        |
| Future professional project source docs | `.contexts/` or owner-provided tmp       | Read only when requested; write public summaries from scratch after disclosure review |

## Wireframe Input

The next wireframe or mockup task can start from these decisions:

- public-first project order: `portfolio-ybkim`, `Karly`, `Book-Kong`;
- prominent but secondary source-repository action for `portfolio-ybkim`;
- section model: intro, projects, skills, process, repository, contact/footer;
- project detail template available for public-source projects;
- professional projects held back until private evidence review produces
  approved public labels and summaries.
