# Pre-Release License Compliance Review

This document defines a practical, good-faith license compliance review for the
portfolio before each public production release. It is an engineering control
and evidence trail, not legal advice or a substitute for professional counsel.

## Scope

Review all material distributed from the repository or production build:

- direct and transitive dependencies;
- copied or adapted source snippets, templates, and configuration;
- images, icons, illustrations, video, audio, and other media;
- local or externally loaded fonts;
- third-party notices and attribution obligations; and
- generated assets whose source material or service terms affect reuse.

Original project code and protected portfolio materials still follow the
boundary in root `LICENSE`, `NOTICE.md`, and ADR-0005.

## Evidence Register

Record each third-party item before use.

| Field              | Purpose                                                   |
| ------------------ | --------------------------------------------------------- |
| Item               | Stable name or local path                                 |
| Material Type      | Dependency, code, image, icon, font, media, or other      |
| Source             | Original URL, repository, package, or provider            |
| Author or Supplier | Known rights holder or distributor                        |
| Version or Date    | Version, commit, or retrieval date                        |
| License            | SPDX identifier, named terms, or `Unknown`                |
| Modifications      | Whether and how the material was changed                  |
| Obligations        | Attribution, notice, source offer, redistribution, or use |
| Notice Location    | Product or repository surface satisfying the obligation   |
| Evidence           | Saved license text, URL, scan output, or review note      |
| Disposition        | Approved, Review Required, Rejected, or Not Applicable    |

The implementation may keep this register in a dedicated repository document or
other version-controlled structured file. Do not record secrets or private
license credentials.

## Reviewed Material

### Owner-provided ChatGPT brand assets

- **Item:** the selected logo, favicon, and home-screen icon files distributed
  from `public/assets/brand/`.
- **Material Type:** generated image and vector brand assets.
- **Source:** an earlier owner-operated ChatGPT image-generation session; the
  exact model version is unavailable. The owner supplied the resulting bundle
  in `tmp/portfolio-ybkim-brand-assets/` and approved its use in this product.
- **Author or Supplier:** YB Kim as the directing user; OpenAI supplied the
  generation service.
- **Version or Date:** imported and reviewed on 2026-07-14.
- **License:** project-owned portfolio material under the All Rights Reserved
  boundary in `NOTICE.md`. The current
  [OpenAI Terms of Use](https://openai.com/policies/terms-of-use/) assign Output
  ownership to the user as between the user and OpenAI.
- **Modifications:** the graphic paths and raster artwork are unchanged. SVG
  accessibility metadata and the web app manifest were localized for the
  Korean product.
- **Obligations:** no third-party attribution or redistribution obligation was
  identified. The owner remains responsible for similarity and other
  third-party-rights review because generated output may not be unique.
- **Notice Location:** root `NOTICE.md` and the visible site footer.
- **Evidence:** the owner statement in the implementation request, the retained
  source bundle README, the linked provider terms, and manual asset review.
- **Disposition:** Approved for the selected shipped subset. Unused wordmarks,
  pattern, token CSS, and English social preview remain outside the production
  asset tree.

### Pretendard Variable web font

- **Item:** Pretendard Variable dynamic subset loaded by the portfolio pages.
- **Material Type:** externally loaded font and stylesheet.
- **Source:** the official
  [Pretendard repository](https://github.com/orioncactus/pretendard) distributed
  through jsDelivr at the version-pinned `v1.3.9` release path.
- **Author or Supplier:** Kil Hyung-jin and Pretendard contributors; jsDelivr
  supplies the CDN response.
- **Version or Date:** `v1.3.9`, reviewed on 2026-07-15.
- **License:** SIL Open Font License 1.1.
- **Modifications:** none. The site requests the official variable dynamic
  subset stylesheet and keeps system-font fallbacks in its typography tokens.
- **Obligations:** retain the license and copyright notice when redistributing
  font files. This repository does not redistribute the font binary.
- **Notice Location:** this register; the upstream repository contains the
  applicable license text.
- **Evidence:** the upstream release README, license file, and exact CDN URL in
  `src/layouts/BaseLayout.astro`.
- **Disposition:** Approved for external loading at the pinned release path.

### Simple Icons technology marks

- **Item:** the 23 Simple Icons technology-mark SVG files distributed from
  `public/assets/tech/`.
- **Material Type:** third-party vector brand icons.
- **Source:** the official `simple-icons` package, retrieved from jsDelivr at
  the exact `16.21.0` package version.
- **Author or Supplier:** Simple Icons contributors; the depicted names and
  marks remain associated with their respective trademark owners.
- **Version or Date:** `16.21.0`, retrieved and reviewed on 2026-07-20.
- **License:** CC0-1.0 for the Simple Icons project; the SQLAlchemy icon carries
  MIT metadata in the pinned catalog. The project disclaimer states that CC0
  does not waive third-party trademark rights.
- **Modifications:** none to the distributed SVG paths or `0 0 24 24` view
  boxes. Runtime CSS classes map each mark to its corresponding `16.21.0`
  package metadata color, with explicit contrast variants for very dark marks
  in the dark theme, and a consistent rendered size; technologies without a
  reviewed source asset use a typographic fallback rather than a substituted
  brand mark.
- **Obligations:** use the marks only to identify technologies, do not imply
  endorsement, and recheck upstream legal or brand guidance when replacing or
  materially modifying an icon.
- **Notice Location:** this register. CC0 does not require product attribution.
- **Evidence:** the pinned jsDelivr source path, the upstream license and legal
  disclaimer, and local format and byte-size inspection. The selected set is
  29,662 bytes in aggregate and the largest file is 5,205 bytes.
- **Disposition:** Approved for nominative technology identification in the
  landing-page skill inventory.

### Playwright technology mark

- **Item:** `public/assets/tech/playwright.svg`.
- **Material Type:** third-party vector brand logo.
- **Source:** the official `microsoft/playwright.dev` repository at commit
  `80f49a3a606302c96e0681bed399079a20456ec6`, file
  `static/img/playwright-logo.svg`.
- **Author or Supplier:** Microsoft and Playwright contributors.
- **Version or Date:** source commit reviewed on 2026-07-21.
- **License:** CC BY 4.0.
- **Modifications:** whitespace-only SVG minification; the paths, colors, and
  `400 × 400` view box are unchanged. CSS renders the multicolor artwork at the
  same `1.2rem` visual slot used by the other technology marks.
- **Obligations:** retain attribution, link the license, indicate whether the
  asset was modified, and do not imply Microsoft or Playwright endorsement.
- **Notice Location:** this register.
- **Evidence:** the immutable GitHub source commit, repository license metadata,
  and local SVG format and byte-size inspection. The local file is 4,993 bytes.
- **Disposition:** Approved for nominative technology identification in the
  landing-page skill inventory.

### Slack technology mark

- **Item:** `public/assets/tech/slack.png`.
- **Material Type:** third-party raster brand icon.
- **Source:** the official Slack CDN asset
  `https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png`,
  referenced alongside the current Slack Media Kit and brand guidance.
- **Author or Supplier:** Slack Technologies, LLC.
- **Version or Date:** retrieved and reviewed on 2026-07-24; source SHA-256
  `fff0ab554a4dc202afd1cbf2033a3ad340cf25b4991035d2d31407b5e7e4c366`.
- **License:** Slack trademark and media-kit usage terms.
- **Modifications:** none; the 256 × 256 PNG bytes are unchanged. CSS renders
  the multicolor artwork in the existing technology-mark slot.
- **Obligations:** use only to identify Slack, preserve the supplied artwork,
  follow the current Slack brand guidance, and do not imply sponsorship or
  endorsement.
- **Notice Location:** this register.
- **Evidence:** the current Slack Media Kit and brand-guideline URLs, successful
  response metadata from the official CDN, the recorded source hash, and local
  format inspection.
- **Disposition:** Approved for nominative technology identification in the
  landing-page skill inventory.

## Review Workflow

1. Inventory third-party material when it enters the repository, not only at
   release time.
2. Keep Dependency Review as the package-license policy gate.
3. Run the pinned ScanCode Toolkit evidence workflow before the first production
   release and when third-party material changes. It detects code origin,
   copyright, license, packages, and dependency metadata.
4. Review scanner findings manually. Resolve false positives, unknown licenses,
   copied snippets, media, fonts, and generated assets that package metadata
   cannot decide.
5. Add required attribution or license text to `THIRD_PARTY_NOTICES.md`, the
   product, or an asset-specific surface. Create the file only when third-party
   obligations require it.
6. Inspect the production build so excluded source or replaced assets are not
   confused with shipped material.
7. Block release while any shipped item remains `Unknown`, `Review Required`, or
   `Rejected`.
8. Preserve the scanner report and completed checklist as release workflow
   evidence without committing large generated reports.

## Decision Policy

- Approve original project material only under the documented MIT or All Rights
  Reserved boundary.
- Approve permissively licensed third-party material after satisfying its notice
  and attribution terms.
- Review copyleft, source-available, non-commercial, editorial-use, custom, or
  conflicting terms individually before use.
- Reject material with no identifiable source or permission unless it is removed
  or replaced.
- Do not treat an automated license name as proof that every obligation has been
  satisfied.

## Account-Free Evidence Gate

The credential-free release-evidence workflow pins ScanCode Toolkit `32.5.0`
from the official Python 3.12 Linux archive and verifies SHA-256
`638adcd0af576d1f4d5b64dde228724b3ca4fdee2c4de20d88e4356be353f027`
before execution. It scans two deliberately separate inputs:

- `git archive` of the exact checked revision for tracked source evidence; and
- the already checked `dist/` artifact for shipped-material evidence.

This excludes `.git`, `node_modules`, ignored private context, and temporary
trees from the scanned inputs. The workflow preserves both ScanCode JSON reports
and the validated CycloneDX SBOM as GitHub Actions artifacts. It is available to
eligible same-repository, non-draft pull requests, reusable workflow callers,
and manual dispatch; it has read-only repository permission and performs no
deployment or GitHub Release mutation.

Structural validation rejects a wrong ScanCode version, malformed report,
header error, or per-file scan error. Scanner warnings and detected licenses
remain evidence for human classification; the validator does not convert them
to an approval.

## 2026-07-31 Account-Free Evidence Review

The PR #63 exact-revision workflow produced structurally valid ScanCode `32.5.0`
reports for 265 tracked-source entries and 58 checked-`dist` entries. Both
reports had no scanner warning, header error, or per-file scan error. The
`dist` report contained no license detection.

The source report's proprietary, `free-unknown`, `lgpl-2.0-plus`, and
`unknown-license-reference` findings were traced to license-policy,
architecture, operations-guideline, and backlog terminology rather than
shipped third-party material. The dependency-review workflow's detected
license expression was its configured allow-list. The shipped image inventory
matched the approved owner-provided brand assets, Simple Icons marks,
Playwright mark, Slack mark, and project-owned SVG sprite recorded above.

Every shipped evidence-register item remains `Approved`; none has an `Unknown`,
`Review Required`, or `Rejected` disposition. Under the delegated conditional
owner approval, this review completes `PBI-030`. A production release must
still rerun and preserve the evidence, and new or changed third-party material
reopens the review.
