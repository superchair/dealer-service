# Base image
FROM node:20.18.0-alpine AS base
WORKDIR /app
COPY package* ./
RUN npm install
COPY . .
RUN npm run build

# Local development image
FROM base AS local
ARG BUILD_NUMBER=Unknown
ARG BUILD_VERSION=Unknown
ENV BUILD_NUMBER=$BUILD_NUMBER
ENV BUILD_VERSION=$BUILD_VERSION
EXPOSE 8000
EXPOSE 8001
CMD ["npm", "run", "start:dev"]

# Release image
FROM node:22.11.0-alpine AS release
ARG BUILD_NUMBER=Unknown
ARG BUILD_VERSION=Unknown
ENV BUILD_NUMBER=$BUILD_NUMBER
ENV BUILD_VERSION=$BUILD_VERSION
WORKDIR /app
COPY package* ./
RUN npm install --omit=dev
COPY --from=base ./app/public ./public
COPY --from=base ./app/dist ./dist
EXPOSE 8000
CMD ["npm", "start"]