resource "github_repository" "this" {
  name        = var.repository_name
  description = "portfolio of Yongbeom Kim who is a web developer"
  visibility  = "public"

  has_issues      = false
  has_projects    = false
  has_wiki        = false
  has_discussions = false

  allow_merge_commit  = true
  allow_squash_merge  = true
  allow_rebase_merge  = false
  allow_auto_merge    = false
  allow_update_branch = true

  delete_branch_on_merge = true

  security_and_analysis {
    secret_scanning {
      status = "enabled"
    }

    secret_scanning_push_protection {
      status = "enabled"
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}

import {
  to = github_repository.this
  id = var.repository_name
}
