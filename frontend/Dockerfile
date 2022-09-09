FROM node:16.14-slim AS builder

ARG VITE_MAPBOX_ACCESS_TOKEN
WORKDIR /app
ADD package*.json ./
RUN npm ci
ADD . ./
RUN npm run build

FROM steebchen/nginx-spa:stable AS runner
# FROM nginx:alpine AS runner
COPY --from=builder /app/dist /app

CMD ["nginx"]
