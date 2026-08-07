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
