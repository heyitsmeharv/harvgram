provider "aws" {
  alias  = "london"
  region = "eu-west-2"
}

provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}

provider "aws" {
  profile = "assume-role-sandbox"
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

terraform {
  required_version = ">= 1.7.3"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket  = "harvgram"
    key     = "terraform-states/sandbox/harvgram.tfstate"
    region  = "eu-west-2"
    encrypt = true
  }
}
