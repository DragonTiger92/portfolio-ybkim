variable "cloudflare_account_id" {
  description = "Cloudflare account that owns Pages and Access."
  type        = string

  validation {
    condition     = can(regex("^[0-9a-f]{32}$", var.cloudflare_account_id))
    error_message = "cloudflare_account_id must be a 32-character lowercase hexadecimal ID."
  }
}

variable "access_identity_provider_id" {
  description = "Existing Cloudflare Access identity provider UUID used for owner authentication."
  type        = string

  validation {
    condition     = can(regex("^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", var.access_identity_provider_id))
    error_message = "access_identity_provider_id must be a lowercase UUID."
  }
}

variable "pages_project_name" {
  description = "Cloudflare Pages Direct Upload project name."
  type        = string
  default     = "portfolio-ybkim"

  validation {
    condition     = can(regex("^[a-z0-9](?:[a-z0-9-]{0,56}[a-z0-9])?$", var.pages_project_name))
    error_message = "pages_project_name must contain 1-58 lowercase letters, digits, or hyphens."
  }
}

variable "production_branch" {
  description = "Branch whose Direct Upload deployments are production deployments."
  type        = string
  default     = "main"

  validation {
    condition     = var.production_branch == "main"
    error_message = "production_branch must remain main for this repository."
  }
}
