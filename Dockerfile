FROM node:18.16-alpine3.18 AS frontend-builder
RUN corepack enable && corepack prepare yarn@4.13.0 --activate

WORKDIR /app

COPY front/package.json front/yarn.lock front/.yarnrc.yml ./
RUN yarn install

ARG REACT_APP_PHUX_YEAR
ENV REACT_APP_PHUX_YEAR=${REACT_APP_PHUX_YEAR}

COPY front/ .
RUN yarn build

FROM node:18.16-alpine3.18 AS backend-builder
RUN corepack enable && corepack prepare yarn@4.13.0 --activate
WORKDIR /app

COPY back/package.json back/yarn.lock back/.yarnrc.yml ./
RUN yarn install

COPY back/ .
RUN yarn build-ts

FROM node:18.16-alpine3.18 AS runner
WORKDIR /app

COPY --from=frontend-builder /app/build ./front/build

WORKDIR /app/back

COPY --from=backend-builder /app/dist ./dist/
COPY --from=backend-builder /app/package.json ./
COPY --from=backend-builder /app/node_modules ./node_modules/

CMD ["yarn", "start"]