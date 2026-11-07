# k8s/dockerfiles/frontend/Dockerfile

FROM node:25.2.1-alpine
WORKDIR /app

# configure node.js
COPY prep-reps/package.json ./
COPY prep-reps/package-lock.json ./
RUN npm ci
COPY prep-reps .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
