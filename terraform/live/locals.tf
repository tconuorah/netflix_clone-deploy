locals {
  # Workspace becomes your env name: dev, staging, prod
  env = terraform.workspace

  name = "${var.project}-${local.env}"

  # Prefix used for naming resources so they don't collide across envs
  name_prefix = "${var.project}-${local.env}"

  # Per-env VPC CIDRs
  vpc_cidrs = {
    dev     = "10.10.0.0/16"
    staging = "10.20.0.0/16"
    prod    = "10.30.0.0/16"
  }

  # Per-env subnets (2 AZs)
  public_subnets_by_env = {
    dev     = ["10.10.1.0/24", "10.10.2.0/24"]
    staging = ["10.20.1.0/24", "10.20.2.0/24"]
    prod    = ["10.30.1.0/24", "10.30.2.0/24"]
  }

  private_subnets_by_env = {
    dev     = ["10.10.11.0/24", "10.10.12.0/24"]
    staging = ["10.20.11.0/24", "10.20.12.0/24"]
    prod    = ["10.30.11.0/24", "10.30.12.0/24"]
  }

  # Final values used by modules (fallbacks provided)
  vpc_cidr        = lookup(local.vpc_cidrs, local.env, "10.50.0.0/16")
  public_subnets  = lookup(local.public_subnets_by_env, local.env, ["10.50.1.0/24", "10.50.2.0/24"])
  private_subnets = lookup(local.private_subnets_by_env, local.env, ["10.50.11.0/24", "10.50.12.0/24"])

  # Tags: your base tags + env tag from workspace
  tags = merge(var.tags, {
    Env  = local.env
    name = var.project
  })
}
