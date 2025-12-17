#!/bin/bash
set -euxo pipefail

dnf update -y
dnf install -y docker git jq awscli
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/kubectl

# helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

mkdir -p /opt/jenkins
chown -R ec2-user:ec2-user /opt/jenkins

docker run -d --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v /opt/jenkins:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --restart always \
  jenkins/jenkins:lts
