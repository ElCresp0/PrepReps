# PreReps deployment with Kubernetes

## Prerequisites

- docker
- minikube
- kubectl

## Commands

### Pure Docker Setup

```bash
# cd to project root dir

# setup docker network
docker network create prepreps-network

# setup postgresql
docker build -t prepreps-postgresql-image -f ./k8s/dockerfiles/postgresql/Dockerfile .
docker run --network prepreps-network -p 5432:5432 --env-file backend/.env --name prepreps-db prepreps-postgresql-image

# setup backend
# backend/config/database.yml has to have `host: prepreps-db` matching postgresql container name
docker build -t prepreps-backend-image -f ./k8s/dockerfiles/backend/Dockerfile .
docker run --network prepreps-network -p 3000:3000 --env-file backend/.env --name prepreps-backend prepreps-backend-image
# perform the DB migration in running container
docker exec prepreps-backend bundle exec rails db:create
docker exec prepreps-backend bundle exec rails db:migrate

# setup frontend
# prep-reps/.env has to have `PUBLIC_BACKEND_HOST=prepreps-backend` matching backend container name
docker build -t prepreps-frontend-image -f ./k8s/dockerfiles/frontend/Dockerfile .
docker run --network prepreps-network -p 5173:5173 --env-file prep-reps/.env --name prepreps-frontend prepreps-frontend-image
```

## TODO

- deploy via docker-compose
- write `YAML` configurations
- deploy locally via minikube
- write documentation
- consider using Helm
- consider breaking frontend and/or backend images to `build` and `run` steps
- perform DB migration as separate `Kubernetes Job`
