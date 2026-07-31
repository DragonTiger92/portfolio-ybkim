variable "betteruptime_api_token" {
  description = "Team-scoped Better Stack Uptime API token supplied by HCP Terraform."
  type        = string
  sensitive   = true
}

variable "production_base_url" {
  description = "Canonical HTTPS production origin without a path."
  type        = string

  validation {
    condition     = can(regex("^https://[^/?#]+/?$", var.production_base_url))
    error_message = "production_base_url must be an HTTPS origin without a path, query, or fragment."
  }
}

variable "critical_asset_path" {
  description = "Stable public asset checked independently from the homepage."
  type        = string
  default     = "/assets/brand/logo-mark.svg"

  validation {
    condition     = startswith(var.critical_asset_path, "/") && !strcontains(var.critical_asset_path, "..")
    error_message = "critical_asset_path must be an absolute site path without parent traversal."
  }
}
