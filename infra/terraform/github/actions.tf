resource "github_actions_variable" "dependabot_automerge_enabled" {
  repository    = github_repository.this.name
  variable_name = "DEPENDABOT_AUTOMERGE_ENABLED"
  value         = "true"
}
