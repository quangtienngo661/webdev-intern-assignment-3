FROM node:24-bookworm-slim AS build

WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

ARG DATABASE_URL=postgresql://postgres:postgres@postgres:5432/g_scores?schema=public
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate
RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npm run db:deploy && npm run db:seed && npm run start:prod"]
