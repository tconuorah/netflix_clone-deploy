pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    AWS_REGION        = 'us-east-2'
    AWS_ACCOUNT_ID    = '022440376442'
    ECR_REPO_NAME     = 'netflix'
    EKS_CLUSTER_NAME  = 'netflix-eks'

    // Helm settings
    HELM_RELEASE      = 'netflix'
    HELM_NAMESPACE    = 'netflix'
    HELM_CHART_PATH   = './helm/netflix'   // <-- path to your chart in the repo

    // Derived
    ECR_REGISTRY      = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    IMAGE_REPO        = "${ECR_REGISTRY}/${ECR_REPO_NAME}"
    IMAGE_TAG         = 'latest'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    
    stage('Build Docker Image') {
      steps {
        sh """
          docker build -t ${IMAGE_REPO}:${IMAGE_TAG} ./app
        """
      }
    }

    stage('Login to ECR & Push') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
          sh """
            aws --version
            aws ecr describe-repositories --repository-names ${ECR_REPO_NAME} --region ${AWS_REGION} >/dev/null 2>&1 || \
              aws ecr create-repository --repository-name ${ECR_REPO_NAME} --region ${AWS_REGION}

            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

            docker push ${IMAGE_REPO}:${IMAGE_TAG}
          """
        }
      }
    }

      stage('Deploy to EKS with Helm') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
          sh """
            set -e
            aws sts get-caller-identity
            aws eks update-kubeconfig --name ${EKS_CLUSTER_NAME} --region ${AWS_REGION}
            
            kubectl get ns --request-timeout=10s -v=6
            kubectl get ns ${HELM_NAMESPACE} >/dev/null 2>&1 || kubectl create ns ${HELM_NAMESPACE}

            helm upgrade --install ${HELM_RELEASE} ${HELM_CHART_PATH} \
              --namespace ${HELM_NAMESPACE} \
              --set image.repository=${IMAGE_REPO} \
              --set image.tag=${IMAGE_TAG} \
              --atomic --timeout 10m
          """
        }
      }
    }
  }
  
  post {
    always {
      // Best-effort cleanup
      sh """
        docker image rm -f ${IMAGE_REPO}:${IMAGE_TAG} >/dev/null 2>&1 || true
      """
    }
    success {
      echo "✅ Deployed ${HELM_RELEASE} with image ${IMAGE_REPO}:${IMAGE_TAG}"
    }
    failure {
      echo "❌ Pipeline failed. Check logs in Jenkins stages above."
    }
  }
}
