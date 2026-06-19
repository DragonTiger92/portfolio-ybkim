locals {
  managed_labels = {
    "release:major" = {
      color       = "b60205"
      description = "Production release contains a major product or UX change"
    }
    "release:minor" = {
      color       = "0e8a16"
      description = "Production release contains a user-visible feature or content addition"
    }
    "release:not-applicable" = {
      color       = "cfd3d7"
      description = "Change does not require a production release version bump"
    }
    "release:patch" = {
      color       = "fbca04"
      description = "Production release contains a fix, polish, or small improvement"
    }
    "skip-changelog" = {
      color       = "eeeeee"
      description = "Exclude from generated release notes"
    }
    "type:a11y" = {
      color       = "bfdadc"
      description = "Accessibility improvement or validation"
    }
    "type:ci" = {
      color       = "5319e7"
      description = "CI, checks, hooks, or automation change"
    }
    "type:content" = {
      color       = "5319e7"
      description = "Portfolio copy, case study, or content model change"
    }
    "type:deps" = {
      color       = "0366d6"
      description = "Dependency or package metadata change"
    }
    "type:docs" = {
      color       = "0075ca"
      description = "Documentation or ADR change"
    }
    "type:feature" = {
      color       = "1d76db"
      description = "User-visible feature or capability"
    }
    "type:fix" = {
      color       = "d73a4a"
      description = "Bug fix or defect correction"
    }
    "type:infra" = {
      color       = "5319e7"
      description = "Hosting, deployment, IaC, or repository settings change"
    }
    "type:performance" = {
      color       = "fbca04"
      description = "Performance or build-size related change"
    }
    "type:security" = {
      color       = "d93f0b"
      description = "Security, privacy, or supply-chain change"
    }
    "type:ui" = {
      color       = "006b75"
      description = "Visual, layout, or interaction change"
    }
  }
}

resource "github_issue_label" "managed" {
  for_each = local.managed_labels

  repository  = github_repository.this.name
  name        = each.key
  color       = each.value.color
  description = each.value.description
}
