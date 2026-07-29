# Resume And Portfolio Boundary

This document defines how the downloadable resume and the portfolio site should
work together without duplicating each other or exposing unnecessary personal
data. It is public-safe and intentionally avoids private source details.

Use this document before drafting the public resume PDF, portfolio wireframes,
project pages, or recruiter-facing contact actions.

## Purpose Split

| Entity    | Primary Job                                                     | Reader Task                                        |
| --------- | --------------------------------------------------------------- | -------------------------------------------------- |
| Resume    | Summarize fit for a specific hiring process                     | Scan role fit, experience, skills, and contact     |
| Portfolio | Prove selected claims with inspectable public artifacts         | Inspect work, decisions, implementation, links     |
| Interview | Discuss private, confidential, or deeper implementation context | Validate judgment, depth, ownership, and tradeoffs |

The resume should be concise, application-ready, and easy to export as PDF. The
portfolio should carry the deeper evidence: project details, repository links,
documentation cues, public demos, and disclosure-reviewed case studies.

## Resume Contact And Personal Data

Use the smallest contact surface that lets a legitimate recruiter respond.

| Field            | Public Downloadable Resume Decision                                         |
| ---------------- | --------------------------------------------------------------------------- |
| Email            | Use `dczwtu12b+portfolio@gmail.com` until the Phase 3 domain email is ready |
| Portfolio URL    | Add after the production URL is decided                                     |
| GitHub           | Include `https://github.com/DragonTiger92`                                  |
| Location         | Optional city/region-level location only if it improves hiring clarity      |
| Phone            | Omit from the public web-download resume by default                         |
| Home address     | Do not include                                                              |
| Birthdate or age | Do not include                                                              |
| Photo            | Do not include                                                              |
| References       | Do not list                                                                 |

Phone numbers and more specific location details can be provided in an
application form or later recruiter process when the channel and purpose are
clear. The public resume should not pre-publish them for broad web indexing.

## Resume Content Responsibility

The resume should answer "Should this candidate move to the next hiring step?"
quickly.

- Use `Web Developer` as the primary role label. Present frontend as the
  strongest axis, and backend, infrastructure, deployment, operations, and
  documentation as adjacent coverage rather than the headline identity.
- Keep the public resume to one page unless the reviewed current experience
  clearly needs a second page.
- Use reverse chronological order for employment and current experience.
- Use factual, result-oriented bullets with active verbs and concrete scope
  where disclosure review allows it.
- Keep project entries selective. Mention the best public projects, then send
  the reader to the portfolio for detail.
- Keep the skill section grouped and short. Avoid a long proficiency-ranked
  tool list.
- Keep private professional evidence generalized unless the owner has approved
  exact names, details, screenshots, or metrics.
- The owner has approved `주식회사 룰메이커스` as the employer name and the
  academy product URL as public resume evidence. Internal product names, code
  names, source, architecture, private URLs, and domain information remain
  excluded.
- Remove stale beginner-positioning material unless it still supports the
  current target role.
- Do not include the reason for leaving in the public resume body by default.
  Prepare it for application forms or interviews when explicitly asked.

## Language Strategy

Maintain two editable resume sources:

| Version | Purpose                                                                 |
| ------- | ----------------------------------------------------------------------- |
| Korean  | Main resume for domestic opportunities                                  |
| English | Companion resume for foreign or English-interview-capable opportunities |

Both versions should share the same claim boundary, project order, contact
policy, and disclosure review status. The English version should be a natural
English resume, not a literal line-by-line translation.

For the initial Korean portfolio, publish only the approved Korean resume PDF.
Keep the English companion application-only until the owner explicitly approves
a second public asset or the English portfolio work adopts it.

## Portfolio Content Responsibility

The portfolio should answer "Can I inspect credible evidence behind the resume?"

- Use project cards and detail pages for problem, role, approach, result,
  stack, and public links.
- Use repository, documentation, ADR, and quality-gate references as current
  evidence.
- Use screenshots and media only after private-data, attribution, and
  presentation-context review. Karly and Book-Kong media/design assets are
  owner-approved candidates; professional screenshots remain separately gated.
- Keep professional work public-safe through generalized labels unless exact
  names and copy are approved.
- Do not quote or paraphrase recommendation-letter content on the public site.

## Overlap Rule

Resume and portfolio may mention the same project, but they should operate at
different detail levels.

| Claim Type                                                        | Resume Treatment                                     | Portfolio Treatment                                                           |
| ----------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| Current portfolio product                                         | One bullet or compact project entry                  | Primary case study with source, docs, and quality evidence                    |
| Public team projects                                              | One or two impact bullets across selected projects   | Short detail pages with public repo and demo links                            |
| Academy information and consultation service                      | Public URL plus reviewed capability bullet           | Professional highlight with public URL and generalized copy                   |
| Science-question concept and solution-logic structuring tool      | Verified owner-attributed frontend foundation bullet | Professional highlight with no private source or later-feature overclaim      |
| Internal science education content production and review platform | Generalized inherited-system capability bullet       | Professional highlight with no private source, URL, screenshots, or internals |
| Recommendation material                                           | Applicant-only support, not public resume copy       | No public website content                                                     |

## Editable Source And Public PDF

Use a two-artifact workflow:

| Artifact             | Path Or Location                   | Publication Rule                                       |
| -------------------- | ---------------------------------- | ------------------------------------------------------ |
| Editable DOCX source | Owner-controlled private workspace | Private draft until owner approval                     |
| Public PDF output    | `/assets/resume/yb-kim-resume.pdf` | Publish only after content, privacy, and visual review |

The DOCX source should stay private by default so contact details, application
variants, and draft wording do not become public repository content. If
language-specific sources are used, keep them under the same private resume
workspace. The final PDF can be copied into the public asset path only after
review.

## Format Direction

The resume should be human-editable and ATS-friendly:

- DOCX source, exported to PDF for applications and portfolio download.
- Clean single-column structure by default.
- No photo, decorative graphics, text boxes, or layout tables that make parsing
  fragile.
- Clear headings, consistent spacing, and readable typography.
- Direct PDF export check before publishing.
- PDF metadata scrub before publication when practical.

## Public Benchmarks Used

The working standard follows common career-center resume guidance:

- Harvard Mignone Center for Career Success describes a resume as a concise
  summary that should highlight strongest assets, be tailored to the target
  position, use factual/result-oriented language, and convert cleanly to PDF:
  <https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/>
- This project applies those general rules with a stricter public-web privacy
  boundary because the resume will be downloadable from the portfolio, not only
  uploaded to individual application forms.

## Pre-Publish Checklist

- Public contact uses the portfolio email alias or Phase 3 domain email.
- Home address, birthdate, age, photo, and personal phone are absent from the
  public downloadable version.
- Old portfolio URLs, stale role framing, and outdated project descriptions are
  removed or rewritten.
- Every strong claim maps to public evidence, disclosure-reviewed private
  evidence, or applicant-only interview support.
- Public project links are checked.
- PDF renders cleanly and contains no unintended comments, tracked changes,
  private metadata, or hidden source notes.
- Portfolio content source and resume content still agree on project labels,
  link destinations, and disclosure status.
- The public site exposes only the approved language asset; private companion
  drafts are not copied into public assets.
