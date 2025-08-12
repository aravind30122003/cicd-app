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
     stage('Deploy to Kubernetes') {
            steps {
                withCredentials([string(credentialsId: 'kubeconfig-creds-text', variable: 'KUBECONFIG_CONTENT')]) {
                    sh '''
                        echo "$KUBECONFIG_CONTENT" > kubeconfig.yaml
                        export KUBECONFIG=$PWD/kubeconfig.yaml
                        
                        # Optional: verify access
                        kubectl get ns
                        
                        # Apply your k8s manifests here
                        kubectl apply -f k8s/deployment.yaml
                        kubectl apply -f k8s/service.yaml
                    '''
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
    }
}
    
