# Builder stage
FROM node:20-slim AS builder

COPY package.json yarn.lock ./

RUN yarn install --ignore-scripts --frozen-lockfile

COPY . ./

RUN yarn build && yarn doc

# Installer stage
FROM node:20-slim AS installer

COPY package.json yarn.lock ./

RUN yarn install --prod --frozen-lockfile

# Runtime stage
FROM node:20-slim AS runtime

LABEL authors="Bamboo Software"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --from=builder dist ./dist
COPY --from=builder data ./data
COPY --from=builder public ./public
COPY --from=builder documentation ./documentation
COPY --from=installer node_modules ./node_modules

COPY package.json ./

ARG PORT=$PORT

EXPOSE $PORT

CMD [ "node", "dist/main.js" ]