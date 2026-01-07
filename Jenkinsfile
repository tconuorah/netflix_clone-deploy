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

      // Visibility (safe to log)
      echo "Using IMAGE_REPO=${env.IMAGE_REPO}"
      echo "Using IMAGE_TAG=${env.IMAGE_TAG}"
    }
  }
}



    stage('Build Docker Image') {
      steps {
        sh """
          set -e
          AWS_ACCOUNT_ID=\$(aws sts get-caller-identity --query Account --output text)
          ECR_REGISTRY="\${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
          IMAGE_REPO="\${ECR_REGISTRY}/${ECR_REPO_NAME}"

          docker build -t \${env.IMAGE_REPO}:${env.IMAGE_TAG} ./app
          echo "IMAGE_REPO=\${env.IMAGE_REPO}" > image.env
        """
      }
    }

    stage('Login to ECR & Push') {
      steps {
        sh """
          set -e
          . image.env

          echo "IMAGE_REPO=\$IMAGE_REPO"
          echo "IMAGE_TAG=${env.IMAGE_TAG}"

          aws sts get-caller-identity

          aws ecr describe-repositories --repository-names ${ECR_REPO_NAME} --region ${AWS_REGION} >/dev/null 2>&1 || \
            aws ecr create-repository --repository-name ${ECR_REPO_NAME} --region ${AWS_REGION}

          REGISTRY="\$(echo \$IMAGE_REPO | cut -d/ -f1)"
          aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin "\$REGISTRY"

          docker push "\$IMAGE_REPO:${env.IMAGE_TAG}"
        """
      }
    }


    stage('Deploy to EKS with Helm') {
      steps {
        sh """
          set -e
          . image.env

          aws eks update-kubeconfig --name ${EKS_CLUSTER_NAME} --region ${AWS_REGION}

          kubectl get ns --request-timeout=10s
          helm upgrade --install ${HELM_RELEASE} ${HELM_CHART_PATH} \
            --namespace ${HELM_NAMESPACE} \
            --create-namespace \
            --set image.repository=\${env.IMAGE_REPO} \
            --set image.tag=${env.IMAGE_TAG} \
            --atomic --timeout 10m
        """
      }
    }
  }

  post {
    always {
      sh """
        set +e
        if [ -f image.env ]; then . image.env; fi
        [ -n "\${env.IMAGE_REPO}" ] && docker image rm -f \${env.IMAGE_REPO}:${env.IMAGE_TAG} >/dev/null 2>&1 || true
      """
    }
  }
}
