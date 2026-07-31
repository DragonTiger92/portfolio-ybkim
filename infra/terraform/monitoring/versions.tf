terraform {
  required_version = "= 1.15.6"

  required_providers {
    betteruptime = {
      source  = "BetterStackHQ/better-uptime"
      version = "= 0.21.10"
    }
  }
}
