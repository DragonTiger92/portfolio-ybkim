output "repository_url" {
  description = "Managed repository URL."
  value       = github_repository.this.html_url
}

output "main_ruleset_id" {
  description = "GitHub ID of the managed main-branch ruleset."
  value       = github_repository_ruleset.main.ruleset_id
}
