locals {
  production_zone         = one(data.cloudflare_zones.production.result)
  pages_hostname          = "${var.pages_project_name}.pages.dev"
  preview_access_hostname = "*.${local.pages_hostname}"
  contact_route_address   = "${var.contact_address_local_part}@${var.production_zone_name}"
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

resource "cloudflare_pages_domain" "apex" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.portfolio.name
  name         = var.production_zone_name

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_dns_record" "apex_pages" {
  zone_id = local.production_zone.id
  name    = var.production_zone_name
  type    = "CNAME"
  content = local.pages_hostname
  ttl     = 1
  proxied = true

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

  policies = [{
    id         = cloudflare_zero_trust_access_policy.preview_account_members.id
    precedence = 1
  }]

  lifecycle {
    prevent_destroy = true

    precondition {
      condition     = data.cloudflare_zero_trust_access_identity_provider.owner.type == "cloudflare"
      error_message = "The selected Access identity provider must be the existing Cloudflare IdP."
    }
  }
}

resource "cloudflare_email_routing_address" "portfolio_destination" {
  account_id = var.cloudflare_account_id
  email      = var.email_destination_address

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_email_routing_settings" "production" {
  zone_id = local.production_zone.id

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_email_routing_rule" "portfolio_contact" {
  zone_id = local.production_zone.id
  name    = "Forward portfolio contact requests"
  enabled = true
  source  = "api"

  actions = [{
    type  = "forward"
    value = [cloudflare_email_routing_address.portfolio_destination.email]
  }]

  matchers = [{
    type  = "literal"
    field = "to"
    value = local.contact_route_address
  }]

  depends_on = [cloudflare_email_routing_settings.production]

  lifecycle {
    prevent_destroy = true

    precondition {
      condition     = cloudflare_email_routing_address.portfolio_destination.verified != null
      error_message = "Verify and import the Email Routing destination before enabling the contact rule."
    }
  }
}
