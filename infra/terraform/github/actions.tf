resource "github_actions_variable" "pages_deployment_enabled" {
  repository    = github_repository.this.name
  variable_name = "PAGES_DEPLOYMENT_ENABLED"
  value         = "true"
}
