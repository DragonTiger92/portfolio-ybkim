output "homepage_monitor_url" {
  description = "Canonical homepage URL covered by external monitoring."
  value       = local.production_origin
}

output "critical_asset_monitor_url" {
  description = "Stable asset URL covered independently from the homepage."
  value       = local.critical_asset_url
}
