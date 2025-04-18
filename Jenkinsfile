pipeline {

	agent any

	environment {
		PY_REPO = 'obrpy'
		NPM_REPO = 'obrnpm'
		IMAGE_TAG = 'latest'
		ECR_REGISTRY = ''
	}
 
	stages {

		stage('setup'){
        		def dockerHome = tool 'myDocker'
        		env.PATH = "${dockerHome}/bin:${env.PATH}"
    		}

		stage("build") {

			steps {
				echo "Building docker images..."

				dir("development/pythonDocker") {
					sh 'docker build -t obrpy .'
				}

				dir("development/nodeDocker") {
					sh 'docker build -t obrnpm .'
				}
			}

		}

		stage("test") {

			steps {
				echo "Testing for bugs..."
			}

		}

		stage("login") {

			steps {
				echo "Logging in to AWS..."

                   		sh 'aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 213920689726.dkr.ecr.eu-north-1.amazonaws.com'
               		}
		}

		stage('tag') {

               		steps {
				echo "Tagging builds..."

                       		sh 'docker tag obrnpm:latest 213920689726.dkr.ecr.eu-north-1.amazonaws.com/obrnpm:latest'
				sh 'docker tag obrpy:latest 213920689726.dkr.ecr.eu-north-1.amazonaws.com/obrpy:latest'
               		}
           	}

		stage("deploy") {

			steps {
				echo "Deploying to EC2 repo..."

				script {
					docker.image("${ECR_REGISTRY}/${PY_REPO}:${IMAGE_TAG}").push()
					docker.image("${ECR_REGISTRY}/${NPM_REPO}:${IMAGE_TAG}").push()
				}

			}

		}
	
	}
}