output "jenkins_instance_profile_name" {
  value = aws_iam_instance_profile.jenkins.name
}

output "jenkins_instance_profile_arn" {
  value = aws_iam_instance_profile.jenkins.arn
}
