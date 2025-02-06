terraform {
  required_version = ">= 1.7.3"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket  = "harvgram-terraform-state"
    key     = "sandbox/terraform.tfstate"
    region  = "eu-west-2"
    encrypt = true

    assume_role = {
      role_arn = "arn:aws:iam::039612873345:role/AssumeSandboxAccount"
    }
  }
}

provider "aws" {
  assume_role {
    role_arn = var.role_arn
  }

  default_tags {
    tags = {
      environment = "sandbox"
      project     = "harvgram"
      provisioner = "terraform"
    }
  }

  region = "eu-west-2"
  alias  = "eu-west-2"
}
