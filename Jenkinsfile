pipeline {
    agent any

    environment {
        IMAGE_NAME = "k8s-cicd-app" 
        DOCKERHUB_USERNAME = "aravind310730"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/aravind30122003/k8s-cicd-app.git', branch: 'main' 
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest ."
            }
        }
    stage('Trivy Scan') {
            steps {
                sh "trivy image ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest || true"
            }
        }
 

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred', 
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    sh """
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker push $DOCKER_USERNAME/${IMAGE_NAME}:latest
                    """
                }
            }
        }

      }  // <-- close stages

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }  // <-- close post
}  // <-- close pipeline
    
