locals {
  production_origin  = trimsuffix(var.production_base_url, "/")
  critical_asset_url = "${local.production_origin}/assets/brand/logo-mark.svg"
}

resource "checkly_url_monitor" "homepage" {
  name                      = "Portfolio production homepage"
  activated                 = true
  frequency                 = 2
  locations                 = ["ap-northeast-1", "ap-southeast-1"]
  run_parallel              = false
  should_fail               = false
  muted                     = false
  use_global_alert_settings = false

  request {
    url              = local.production_origin
    follow_redirects = true
    skip_ssl         = false

    assertion {
      source     = "STATUS_CODE"
      comparison = "EQUALS"
      target     = "200"
    }
  }

  alert_settings {
    escalation_type = "RUN_BASED"

    run_based_escalation {
      failed_run_threshold = 1
    }

    reminders {
      amount = 0
    }
  }

  retry_strategy {
    type                 = "SINGLE_RETRY"
    base_backoff_seconds = 60
    same_region          = true
  }

  alert_channel_subscription {
    channel_id = var.checkly_alert_channel_id
    activated  = true
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "checkly_url_monitor" "critical_asset" {
  name                      = "Portfolio production critical asset"
  activated                 = true
  frequency                 = 2
  locations                 = ["ap-northeast-1", "ap-southeast-1"]
  run_parallel              = false
  should_fail               = false
  muted                     = false
  use_global_alert_settings = false

  request {
    url              = local.critical_asset_url
    follow_redirects = true
    skip_ssl         = false

    assertion {
      source     = "STATUS_CODE"
      comparison = "EQUALS"
      target     = "200"
    }
  }

  alert_settings {
    escalation_type = "RUN_BASED"

    run_based_escalation {
      failed_run_threshold = 1
    }

    reminders {
      amount = 0
    }
  }

  retry_strategy {
    type                 = "SINGLE_RETRY"
    base_backoff_seconds = 60
    same_region          = true
  }

  alert_channel_subscription {
    channel_id = var.checkly_alert_channel_id
    activated  = true
  }

  lifecycle {
    prevent_destroy = true
  }
}
