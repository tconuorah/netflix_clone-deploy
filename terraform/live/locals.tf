data "aws_availability_zones" "az" {}

locals {
  env = terraform.workspace
  azs = slice(data.aws_availability_zones.az.names, 0, 2)

  # SIMPLE workspace config:
  envs = {
    dev = {
      vpc_cidr   = "10.0.0.0/16"
      public     = ["10.0.1.0/24", "10.0.2.0/24"]
      private    = ["10.0.11.0/24", "10.0.12.0/24"]
      instance   = "t3.medium"
      node_types = ["t3.medium"]
      desired    = 2
      min        = 1
      max        = 3
    }

    staging = {
      vpc_cidr   = "10.5.0.0/16"
      public     = ["10.5.1.0/24", "10.5.2.0/24"]
      private    = ["10.5.11.0/24", "10.5.12.0/24"]
      instance   = "t3.medium"
      node_types = ["t3.medium"]
      desired    = 2
      min        = 1
      max        = 4
    }

    prod = {
      vpc_cidr   = "10.10.0.0/16"
      public     = ["10.10.1.0/24", "10.10.2.0/24"]
      private    = ["10.10.11.0/24", "10.10.12.0/24"]
      instance   = "t3.medium"
      node_types = ["t3.medium"]
      desired    = 3
      min        = 2
      max        = 6
    }
  }

  # ✅ Strict workspace enforcement
  cfg  = local.envs[local.env]

  name = "${local.env}-netflix"
}
