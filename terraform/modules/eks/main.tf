module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnet_ids

  enable_irsa = true

  eks_managed_node_groups = {
    default = {
      instance_types = ["t3.large"]
      min_size       = 2
      max_size       = 6
      desired_size   = 2
    }
  }

  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  tags = var.tags
}
