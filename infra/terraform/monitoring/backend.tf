terraform {
  cloud {
    organization = "dragontiger92"

    workspaces {
      project = "portfolio-ybkim-infrastructure"
      name    = "portfolio-ybkim-monitoring"
    }
  }
}
