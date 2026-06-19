variable "github_owner" {
  description = "GitHub account that owns the repository."
  type        = string
  default     = "DragonTiger92"
}

variable "repository_name" {
  description = "Existing GitHub repository managed by this Terraform root."
  type        = string
  default     = "portfolio-ybkim"
}

variable "main_ruleset_enforcement" {
  description = "Desired ruleset enforcement after the bootstrap PR is merged."
  type        = string
  default     = "active"

  validation {
    condition     = contains(["active", "disabled"], var.main_ruleset_enforcement)
    error_message = "main_ruleset_enforcement must be active or disabled."
  }
}
