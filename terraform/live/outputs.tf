output "ecr_url" { value = module.ecr.repository_url }
output "eks_name" { value = module.eks.cluster_name }
output "eks_oidc_provider_arn" { value = module.eks.oidc_provider_arn }

output "jenkins_ip" { value = module.jenkins.public_ip }
output "jenkins_role_arn" { value = module.iam.jenkins_role_arn }
