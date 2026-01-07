module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "${local.name}-eks"
  cluster_version = "1.29"

  vpc_id     = aws_vpc.this.id
  subnet_ids = [aws_subnet.private[0].id, aws_subnet.private[1].id]

  cluster_endpoint_public_access  = false
  cluster_endpoint_private_access = true

  eks_managed_node_groups = {
    default = {
      instance_types = local.cfg.node_types
      desired_size   = local.cfg.desired
      min_size       = local.cfg.min
      max_size       = local.cfg.max
      subnet_ids     = [aws_subnet.private[0].id, aws_subnet.private[1].id]
    }
  }
}


resource "aws_eks_access_entry" "jenkins" {
  cluster_name  = module.eks.cluster_name
  principal_arn = aws_iam_role.jenkins.arn
  type          = "STANDARD"
}

resource "aws_eks_access_policy_association" "jenkins_admin" {
  cluster_name  = module.eks.cluster_name
  principal_arn = aws_iam_role.jenkins.arn
  policy_arn    = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"

  access_scope { type = "cluster" }
}

resource "aws_security_group_rule" "jenkins_to_eks_api_egress" {
  type                     = "egress"
  description              = "Jenkins to EKS API"
  security_group_id         = aws_security_group.jenkins.id
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  source_security_group_id = module.eks.cluster_security_group_id
}
