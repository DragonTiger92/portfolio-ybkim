resource "github_repository_ruleset" "main" {
  name        = "Protect main"
  repository  = github_repository.this.name
  target      = "branch"
  enforcement = var.main_ruleset_enforcement

  conditions {
    ref_name {
      include = ["~DEFAULT_BRANCH"]
      exclude = []
    }
  }

  rules {
    deletion         = true
    non_fast_forward = true

    pull_request {
      allowed_merge_methods             = ["merge", "squash"]
      dismiss_stale_reviews_on_push     = false
      require_code_owner_review         = false
      require_last_push_approval        = false
      required_approving_review_count   = 0
      required_review_thread_resolution = true
    }

    required_status_checks {
      strict_required_status_checks_policy = true

      required_check {
        context = "Check"
      }

      required_check {
        context = "Dependency Review"
      }

      required_check {
        context = "PR Metadata"
      }
    }

    required_code_scanning {
      required_code_scanning_tool {
        alerts_threshold          = "errors"
        security_alerts_threshold = "high_or_higher"
        tool                      = "CodeQL"
      }
    }
  }
}
