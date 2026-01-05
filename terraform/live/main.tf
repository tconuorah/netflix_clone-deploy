module "vpc" {
  source          = "../modules/vpc"
  name            = local.name
  cidr            = var.vpc_cidr
  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
  tags            = var.tags
}

module "ecr" {
  source = "../modules/ecr"
  name   = var.project
  tags   = var.tags
}

module "eks" {
  source             = "../modules/eks"
  cluster_name       = "${var.project}-eks"
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnets
  tags               = var.tags
}

# If you already have an IAM module that creates an instance profile, keep this.
# Otherwise, remove the iam_instance_profile lines below.
module "iam" {
  source  = "../modules/iam"
  project = var.project
  tags    = var.tags
}

############################################
# EC2 #1: Jenkins (t2.large)
############################################
module "jenkins" {
  source    = "../modules/ec2"
  name      = "${var.project}-jenkins"
  vpc_id    = module.vpc.vpc_id
  subnet_id = module.vpc.public_subnets[0]

  instance_type = "t2.medium"

  key_name             = var.key_name
  admin_cidrs          = var.admin_cidrs
  tags                 = var.tags
  iam_instance_profile = module.iam.jenkins_instance_profile
}


