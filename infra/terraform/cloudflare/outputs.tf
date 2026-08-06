output "pages_project_name" {
  description = "Cloudflare Pages Direct Upload project name."
  value       = cloudflare_pages_project.portfolio.name
}

output "pages_hostname" {
  description = "Cloudflare-managed Pages hostname."
  value       = local.pages_hostname
}

output "production_hostname" {
  description = "Cloudflare-managed canonical production hostname."
  value       = cloudflare_pages_project.portfolio.subdomain
}

output "preview_access_hostname" {
  description = "Wildcard hostname protected by the Access application."
  value       = cloudflare_zero_trust_access_application.preview.domain
}

output "preview_ci_access_client_id" {
  description = "Client ID for the preview CI Access service token. Transfer only to the scoped GitHub Environment."
  value       = cloudflare_zero_trust_access_service_token.preview_ci_smoke.client_id
  sensitive   = true
}

output "preview_ci_access_client_secret" {
  description = "Client secret for the preview CI Access service token. Available at creation; never print or commit it."
  value       = cloudflare_zero_trust_access_service_token.preview_ci_smoke.client_secret
  sensitive   = true
}
