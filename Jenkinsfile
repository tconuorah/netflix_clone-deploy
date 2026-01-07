pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    AWS_REGION     = 'us-east-2'
    ECR_REPO_NAME  = 'dev-netflix'
    ENV_NAME       = 'dev'                 // <-- set to dev/staging/prod OR make it a parameter
    EKS_CLUSTER_NAME = "${ENV_NAME}-netflix-eks"

    HELM_RELEASE    = 'netflix'
    HELM_NAMESPACE  = 'netflix'
    HELM_CHART_PATH = './helm/netflix'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Set Image Tag') {
      steps {
        script {
          env.IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
        }
      }
    }

    stage('Verify AWS Identity (Instance Role)') {
      steps {
        sh """
          set -e
          aws --version
          aws sts get-caller-identity
        """
      }
    }

    stage('Build Docker Image') {
      steps {
        sh """
          set -e
          AWS_ACCOUNT_ID=\$(aws sts get-caller-identity --query Account --output text)
          ECR_REGISTRY="\${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
          IMAGE_REPO="\${ECR_REGISTRY}/${ECR_REPO_NAME}"

          docker build -t \${IMAGE_REPO}:${IMAGE_TAG} ./app
          echo "IMAGE_REPO=\${IMAGE_REPO}" > image.env
        """
      }
    }

    stage('Login to ECR & Push') {
      steps {
        sh """
          set -e
          source image.env

          aws ecr describe-repositories --repository-names ${ECR_REPO_NAME} --region ${AWS_REGION} >/dev/null 2>&1 || \
            aws ecr create-repository --repository-name ${ECR_REPO_NAME} --region ${AWS_REGION}

          aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin \$(echo ${IMAGE_REPO} | cut -d/ -f1)

          docker push \${IMAGE_REPO}:${IMAGE_TAG}
        """
      }
    }

    stage('Deploy to EKS with Helm') {
      steps {
        sh """
          set -e
          source image.env

          aws eks update-kubeconfig --name ${EKS_CLUSTER_NAME} --region ${AWS_REGION}

          kubectl get ns --request-timeout=10s
          helm upgrade --install ${HELM_RELEASE} ${HELM_CHART_PATH} \
            --namespace ${HELM_NAMESPACE} \
            --create-namespace \
            --set image.repository=\${IMAGE_REPO} \
            --set image.tag=${IMAGE_TAG} \
            --atomic --timeout 10m
        """
      }
    }
  }

  post {
    always {
      sh """
        set +e
        if [ -f image.env ]; then source image.env; fi
        [ -n "\${IMAGE_REPO}" ] && docker image rm -f \${IMAGE_REPO}:${IMAGE_TAG} >/dev/null 2>&1 || true
      """
    }
  }
}
