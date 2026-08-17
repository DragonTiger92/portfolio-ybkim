terraform {
  required_version = "= 1.15.6"

  required_providers {
    checkly = {
      source  = "checkly/checkly"
      version = "= 1.27.0"
    }
  }
}
