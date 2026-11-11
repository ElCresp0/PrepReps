# minikube + kompose

## Tools

- `kompose` has been used to build kubernetes `yaml` definitions based on docker-compose.yml
- `minikube` is used to test kubernetes services locally
- `kubectl` is used to manage images and kubernetes services

## Kompose usage

```bash
# cd to project root directory
kompose -f docker-compose.yml convert -o kompose
```

## Setup

```bash
# either create a repository on docker hub and push the images there
# if images are published to docker hub, `imagePullPolicy` in kubernetes deployments doesn't need to be set
docker push prepreps-frontend-image
docker push prepreps-backend-image

# or load local images to minikube
minikube image load prepreps-backend-image
minikube image load prepreps-frontend-image

# start the kubernetes cluster
minikube start

# apply kubernetes configurations on the cluster
kubectl apply -f "*.yaml"

# perform db migration on backend service
kubectl exec -it prepreps-backend -- bundle exec rails db:create
kubectl exec -it prepreps-backend -- bundle exec rails db:migrate

# apply port forwarding from the frontend service to localhost
kubectl port-forward service/prepreps-frontend 5173:5173

# goto localhost:5173 to see if the frontend is running
```
