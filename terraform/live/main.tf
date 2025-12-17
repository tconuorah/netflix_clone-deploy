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
  name   = "${var.project}"
  tags   = var.tags
}

module "eks" {
  source             = "../modules/eks"
  cluster_name       = "${var.project}-eks"
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnets
  tags               = var.tags
}

module "iam" {
  source  = "../modules/iam"
  project = var.project
  tags    = var.tags
}

module "jenkins" {
  source               = "../modules/ec2"
  name                 = "${var.project}-jenkins"
  vpc_id               = module.vpc.vpc_id
  subnet_id            = module.vpc.public_subnets[0]
  key_name             = var.key_name
  admin_cidrs          = var.admin_cidrs
  tags                 = var.tags
  user_data            = file("${path.module}/user_data_jenkins.sh")
  iam_instance_profile = module.iam.jenkins_instance_profile
}

module "sonar" {
  source      = "../modules/ec2"
  name        = "${var.project}-sonarqube"
  vpc_id      = module.vpc.vpc_id
  subnet_id   = module.vpc.public_subnets[0]
  key_name    = var.key_name
  admin_cidrs = var.admin_cidrs
  tags        = var.tags
  user_data   = file("${path.module}/user_data_sonar.sh")
}
