FROM node:latest as builder

WORKDIR /app
COPY . /app
RUN yarn
RUN yarn run build

FROM nginx:1.16.0-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]