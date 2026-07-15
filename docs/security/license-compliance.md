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

## Review Workflow

1. Inventory third-party material when it enters the repository, not only at
   release time.
2. Keep Dependency Review as the package-license policy gate.
3. Run a pinned source scanner before the first production release and when
   third-party material changes. ScanCode Toolkit is the initial candidate
   because it detects code origin, copyright, license, packages, and dependency
   metadata.
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

## Planned Release Gate

`PBI-030` should add a manually triggered or release-candidate workflow stage
that collects scan evidence and requires the project owner to approve the
completed register before production release. Tool versions and actions must be
pinned when implementation begins; this document does not add a scanner or new
dependency yet.
