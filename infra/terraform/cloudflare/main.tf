locals {
  pages_hostname          = cloudflare_pages_project.portfolio.subdomain
  preview_access_hostname = "*.${local.pages_hostname}"
}

resource "cloudflare_pages_project" "portfolio" {
  account_id        = var.cloudflare_account_id
  name              = var.pages_project_name
  production_branch = var.production_branch

  build_config = {
    destination_dir = "dist"
    root_dir        = "/"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_zero_trust_access_policy" "preview_account_members" {
  account_id       = var.cloudflare_account_id
  name             = "Portfolio preview account members"
  decision         = "allow"
  session_duration = "8h"

  include = [{
    cloudflare_account_member = {
      account_id = var.cloudflare_account_id
    }
  }]

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_zero_trust_access_service_token" "preview_ci_smoke" {
  account_id = var.cloudflare_account_id
  name       = "Portfolio preview CI smoke"
  duration   = "8760h"

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_zero_trust_access_policy" "preview_ci_smoke" {
  account_id = var.cloudflare_account_id
  name       = "Portfolio preview CI smoke"
  decision   = "non_identity"

  include = [{
    service_token = {
      token_id = cloudflare_zero_trust_access_service_token.preview_ci_smoke.id
    }
  }]

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_zero_trust_access_application" "preview" {
  account_id                = var.cloudflare_account_id
  name                      = "Portfolio protected previews"
  type                      = "self_hosted"
  domain                    = local.preview_access_hostname
  session_duration          = "8h"
  allowed_idps              = [data.cloudflare_zero_trust_access_identity_provider.owner.id]
  auto_redirect_to_identity = true
  app_launcher_visible      = false

  destinations = [{
    type = "public"
    uri  = local.preview_access_hostname
  }]

  policies = [
    {
      id         = cloudflare_zero_trust_access_policy.preview_account_members.id
      precedence = 1
    },
    {
      id         = cloudflare_zero_trust_access_policy.preview_ci_smoke.id
      precedence = 2
    },
  ]

  lifecycle {
    prevent_destroy = true

    precondition {
      condition     = data.cloudflare_zero_trust_access_identity_provider.owner.type == "cloudflare"
      error_message = "The selected Access identity provider must be the existing Cloudflare IdP."
    }
  }
}
