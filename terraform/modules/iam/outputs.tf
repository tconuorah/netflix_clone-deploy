output "jenkins_instance_profile" { value = aws_iam_instance_profile.jenkins_profile.name }
output "jenkins_role_arn" { value = aws_iam_role.jenkins_role.arn }
