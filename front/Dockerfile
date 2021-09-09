FROM node:latest as builder

WORKDIR /app
COPY . /app
RUN yarn
RUN yarn run build

# production environment
FROM nginx:1.17.9-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx-default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]