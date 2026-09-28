# Terraform describes infrastructure as code. This tiny example uses the
# 'local' and 'random' providers so it runs with no cloud account — but the
# concepts (providers, resources, variables, outputs, state) are exactly the
# same as provisioning real servers on AWS.

terraform {
  required_version = ">= 1.5"
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

# A provider is a plugin that knows how to manage one kind of thing (AWS, a
# local filesystem, DNS, ...). Real projects declare the aws provider here.
provider "local" {}
provider "random" {}

# A resource is one piece of infrastructure Terraform creates and manages.
resource "random_pet" "name" {
  length = 2
}

# This resource writes a config file — standing in for "create a server" so the
# example is runnable. Terraform will create, update or destroy it to match.
resource "local_file" "greeting" {
  filename = "${path.module}/out/greeting.txt"
  content  = "${var.greeting} from ${random_pet.name.id}\n"
}
