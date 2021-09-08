
FROM node:14
WORKDIR /app
COPY package.json .
COPY . /app
RUN yarn
RUN yarn run build-ts
EXPOSE 8000