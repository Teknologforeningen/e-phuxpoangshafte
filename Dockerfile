FROM node:14
WORKDIR /app
COPY front/ ./front
RUN cd front && yarn && yarn run build

COPY back/ ./back
RUN cd back && yarn && yarn run build-ts

EXPOSE 8000

CMD cd back && yarn start