variable "checkly_api_key" {
  description = "Checkly API key supplied through a protected Terraform input."
  type        = string
  sensitive   = true
  nullable    = false

  validation {
    condition     = length(trimspace(var.checkly_api_key)) > 0
    error_message = "checkly_api_key must not be empty."
  }
}

variable "checkly_account_id" {
  description = "Checkly account ID supplied through a protected Terraform input."
  type        = string
  sensitive   = true
  nullable    = false

  validation {
    condition     = length(trimspace(var.checkly_account_id)) > 0
    error_message = "checkly_account_id must not be empty."
  }
}

variable "checkly_alert_channel_id" {
  description = "Owner-managed Checkly alert channel ID."
  type        = number
  sensitive   = true
  nullable    = false

  validation {
    condition = (
      var.checkly_alert_channel_id > 0 &&
      floor(var.checkly_alert_channel_id) == var.checkly_alert_channel_id
    )
    error_message = "checkly_alert_channel_id must be a positive integer."
  }
}

variable "production_base_url" {
  description = "Canonical HTTPS production origin without a path."
  type        = string
  nullable    = false

  validation {
    condition     = can(regex("^https://[^/?#]+/?$", var.production_base_url))
    error_message = "production_base_url must be an HTTPS origin without a path, query, or fragment."
  }
}
