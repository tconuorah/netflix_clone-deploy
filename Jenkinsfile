pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    AWS_REGION       = 'us-east-2'
    ECR_REPO_NAME    = 'dev-netflix'
    ENV_NAME         = 'dev'                 // make param later if you want
    EKS_CLUSTER_NAME = "${ENV_NAME}-netflix-eks"

    HELM_RELEASE     = 'netflix'
    HELM_NAMESPACE   = 'netflix'
    HELM_CHART_PATH  = './helm/netflix'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build Vars') {
      steps {
        script {
          // Resolve AWS account from instance role
          def acct = sh(
            script: "aws sts get-caller-identity --query Account --output text",
            returnStdout: true
          ).trim()

          // Export once for entire pipeline
          env.IMAGE_REPO = "${acct}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ECR_REPO_NAME}"
          env.IMAGE_TAG  = sh(
            script: "git rev-parse --short HEAD",
            returnStdout: true
          ).trim()

          echo "Using IMAGE_REPO=${env.IMAGE_REPO}"
          echo "Using IMAGE_TAG=${env.IMAGE_TAG}"
        }
      }
    }

    stage('Verify AWS Identity (Instance Role)') {
      steps {
        sh '''#!/usr/bin/env bash
          set -e
          export AWS_PAGER=""
          aws --version
          aws sts get-caller-identity
        '''
      }
    }

    stage('Build Docker Image') {
      steps {
        sh """#!/usr/bin/env bash
          set -e
          docker build -t "${env.IMAGE_REPO}:${env.IMAGE_TAG}" ./app
        """
      }
    }

    stage('Login to ECR & Push') {
      steps {
        sh """#!/usr/bin/env bash
          set -e
          export AWS_PAGER=""

          aws sts get-caller-identity

          aws ecr describe-repositories --repository-names "${env.ECR_REPO_NAME}" --region "${env.AWS_REGION}" >/dev/null 2>&1 || \
            aws ecr create-repository --repository-name "${env.ECR_REPO_NAME}" --region "${env.AWS_REGION}"

          REGISTRY="\$(echo "${env.IMAGE_REPO}" | cut -d/ -f1)"
          aws ecr get-login-password --region "${env.AWS_REGION}" | docker login --username AWS --password-stdin "\$REGISTRY"

          docker push "${env.IMAGE_REPO}:${env.IMAGE_TAG}"
        """
      }
    }

    stage('Deploy to EKS with Helm') {
     steps {
    sh """#!/usr/bin/env bash
      set -e
      export AWS_PAGER=""
      KCFG="/var/jenkins_home/.kube/${env.EKS_CLUSTER_NAME}.config"

      mkdir -p /var/jenkins_home/.kube

      aws eks update-kubeconfig \
        --name "${env.EKS_CLUSTER_NAME}" \
        --region "${env.AWS_REGION}" \
        --kubeconfig "\$KCFG"

      kubectl --kubeconfig "\$KCFG" get ns --request-timeout=20s

      helm --kubeconfig "\$KCFG" upgrade --install "${env.HELM_RELEASE}" "${env.HELM_CHART_PATH}" \
        --namespace "${env.HELM_NAMESPACE}" \
        --create-namespace \
        --set image.repository="${env.IMAGE_REPO}" \
        --set image.tag="${env.IMAGE_TAG}" \
        --atomic --timeout 10m
    """
  }
}


  post {
    always {
      sh """#!/usr/bin/env bash
        set +e
        docker image rm -f "${env.IMAGE_REPO}:${env.IMAGE_TAG}" >/dev/null 2>&1 || true
      """
    }
  }
}
