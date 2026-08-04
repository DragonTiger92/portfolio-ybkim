data "cloudflare_zero_trust_access_identity_provider" "owner" {
  account_id           = var.cloudflare_account_id
  identity_provider_id = var.access_identity_provider_id
}
