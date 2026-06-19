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
