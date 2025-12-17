#!/bin/bash
set -euxo pipefail

dnf update -y
dnf install -y docker
systemctl enable docker
systemctl start docker

docker network create sonar-net || true
mkdir -p /opt/postgres /opt/sonarqube/{data,extensions,logs}

docker run -d --name sonar-db --network sonar-net \
  -e POSTGRES_USER=sonar \
  -e POSTGRES_PASSWORD=sonarpass \
  -e POSTGRES_DB=sonar \
  -v /opt/postgres:/var/lib/postgresql/data \
  --restart always postgres:15

docker run -d --name sonarqube --network sonar-net \
  -p 9000:9000 \
  -e SONAR_JDBC_URL=jdbc:postgresql://sonar-db:5432/sonar \
  -e SONAR_JDBC_USERNAME=sonar \
  -e SONAR_JDBC_PASSWORD=sonarpass \
  -v /opt/sonarqube/data:/opt/sonarqube/data \
  -v /opt/sonarqube/extensions:/opt/sonarqube/extensions \
  -v /opt/sonarqube/logs:/opt/sonarqube/logs \
  --restart always sonarqube:lts-community
