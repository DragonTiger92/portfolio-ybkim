locals {
  production_origin  = trimsuffix(var.production_base_url, "/")
  critical_asset_url = "${local.production_origin}${var.critical_asset_path}"
}

resource "betteruptime_monitor" "homepage" {
  pronounceable_name = "Portfolio production homepage"
  url                = local.production_origin
  monitor_type       = "status"
  check_frequency    = 180
  verify_ssl         = true
  ssl_expiration     = 30
  email              = true
  follow_redirects   = true
  http_method        = "GET"
  request_timeout    = 10

  lifecycle {
    prevent_destroy = true
  }
}

resource "betteruptime_monitor" "critical_asset" {
  pronounceable_name = "Portfolio production critical asset"
  url                = local.critical_asset_url
  monitor_type       = "status"
  check_frequency    = 180
  verify_ssl         = true
  ssl_expiration     = 30
  email              = true
  follow_redirects   = true
  http_method        = "GET"
  request_timeout    = 10

  lifecycle {
    prevent_destroy = true
  }
}
