resource "github_repository_vulnerability_alerts" "this" {
  repository = github_repository.this.name
  enabled    = true
}

resource "github_repository_dependabot_security_updates" "this" {
  repository = github_repository.this.name
  enabled    = true
}

import {
  to = github_repository_vulnerability_alerts.this
  id = var.repository_name
}

import {
  to = github_repository_dependabot_security_updates.this
  id = var.repository_name
}
