# k8s/dockerfiles/frontend/Dockerfile

# run in project root directory:
# docker build -t prepreps-frontend-image -f ./k8s/dockerfiles/frontend/Dockerfile .
# docker run -p 5173:5173 --env-file prep-reps/.env prepreps-frontend-image

FROM node:25.2.1-alpine
WORKDIR /app

# configure node.js
COPY prep-reps/package.json ./
COPY prep-reps/package-lock.json ./
RUN npm ci
COPY prep-reps .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
