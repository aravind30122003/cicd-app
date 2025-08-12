pipeline {
  agent any
  environment {
    DOCKER_HUB_REPO = "aravind310730/k8s-cicd-app"
    K8S_DEPLOYMENT = "k8s-cicd-deployment"
    K8S_CONTAINER = "k8s-cicd-container"
    // set credential IDs used in Jenkins (create these in Jenkins credentials store)
    DOCKER_CREDENTIALS_ID = "docker-hub-creds"
    KUBECONFIG_CREDENTIALS_ID = "kubeconfig-creds" 
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build Image') {
      steps {
        script {
          // use commit hash as tag if available
          def shortCommit = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
          env.IMAGE_TAG = "${shortCommit}"
        }
        sh "docker build -t ${DOCKER_HUB_REPO}:${IMAGE_TAG} ."
      }
    }
    stage('Scan Image (Trivy)') {
      steps {
        // optional: fails pipeline on HIGH/CRITICAL vulnerabilities
        sh '''
          if command -v trivy >/dev/null 2>&1 ; then
            trivy image --severity HIGH,CRITICAL --exit-code 1 ${DOCKER_HUB_REPO}:${IMAGE_TAG} || true
          else
            echo "Trivy not installed on agent; skipping scan"
          fi
        '''
      }
    }
    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker push ${DOCKER_HUB_REPO}:${IMAGE_TAG}
          '''
        }
      }
    }
    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS_ID}", variable: 'KUBECONFIG_FILE')]) {
          sh '''
            export KUBECONFIG=$KUBECONFIG_FILE
            kubectl set image deployment/${K8S_DEPLOYMENT} ${K8S_CONTAINER}=${DOCKER_HUB_REPO}:${IMAGE_TAG} --record
            kubectl rollout status deployment/${K8S_DEPLOYMENT} --timeout=120s
          '''
        }
      }
    }
  }
  post {
    success {
      echo "Pipeline succeeded. Image: ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
    }
    failure {
      echo "Pipeline failed."
    }
  }
}