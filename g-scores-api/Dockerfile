FROM node:24-bookworm-slim AS build

WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN DATABASE_URL=postgresql://postgres:postgres@localhost:5432/g_scores?schema=public npm run prisma:generate
RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npm run db:deploy && if [ \"$RUN_SEED_ON_START\" = \"true\" ]; then npm run db:seed; fi && npm run start:prod"]
