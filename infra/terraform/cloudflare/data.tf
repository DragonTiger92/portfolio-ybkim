data "cloudflare_zones" "production" {
  account = {
    id = var.cloudflare_account_id
  }
  name      = var.production_zone_name
  match     = "all"
  max_items = 2
}

data "cloudflare_zero_trust_access_identity_provider" "owner" {
  account_id           = var.cloudflare_account_id
  identity_provider_id = var.access_identity_provider_id
}
