variable "cloudflare_account_id" {
  description = "Cloudflare account that owns Pages, Access, and Email Routing."
  type        = string

  validation {
    condition     = can(regex("^[0-9a-f]{32}$", var.cloudflare_account_id))
    error_message = "cloudflare_account_id must be a 32-character lowercase hexadecimal ID."
  }
}

variable "production_zone_name" {
  description = "Existing Cloudflare zone and future canonical production hostname."
  type        = string

  validation {
    condition = (
      var.production_zone_name == lower(var.production_zone_name) &&
      can(regex("^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$", var.production_zone_name))
    )
    error_message = "production_zone_name must be a lowercase DNS name without a scheme or path."
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

variable "contact_address_local_part" {
  description = "Local part of the future receive-only custom-domain contact address."
  type        = string
  default     = "contact"

  validation {
    condition     = can(regex("^[a-z0-9](?:[a-z0-9._+-]{0,62}[a-z0-9])?$", var.contact_address_local_part))
    error_message = "contact_address_local_part must be a conservative lowercase email local part."
  }
}

variable "email_destination_address" {
  description = "Existing verified destination for the receive-only contact route."
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", var.email_destination_address))
    error_message = "email_destination_address must be a syntactically valid email address."
  }
}
