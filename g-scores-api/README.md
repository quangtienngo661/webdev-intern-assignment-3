# G-Scores API

NestJS backend for the G-Scores project. The API imports the national exam CSV
dataset into PostgreSQL, exposes score lookup endpoints, and provides aggregate
reports for the frontend dashboard.

## Tech Stack

- NestJS
- TypeScript
- Prisma 7
- PostgreSQL
- csv-parse
- class-validator
- Docker Compose

## Prerequisites

- Node.js 24 or newer
- npm
- PostgreSQL, or Docker Compose from the repository root
- The CSV file at `../dataset/diem_thi_thpt_2024.csv`

## Run With Docker Compose

From the repository root:

```bash
docker compose up -d --build
```

Docker Compose starts:

```text
postgres  PostgreSQL database
api       NestJS API
web       React frontend
```

The API will be available at:

```text
http://localhost:5000
```

The dataset is mounted into the API container with a bind mount:

```yaml
volumes:
  - ./dataset:/dataset:ro
```

Inside the API container, the CSV file is available at:

```text
/dataset/diem_thi_thpt_2024.csv
```

The API container uses this env variable:

```env
SEED_FILE=/dataset/diem_thi_thpt_2024.csv
```

On startup, the API container runs:

```bash
npm run db:deploy && npm run db:seed && npm run start:prod
```

Docker Compose sets `RUN_SEED_ON_START=true`, so the API imports the CSV on
startup. The seed script skips importing if the database already contains score
rows.

## Deploy API on Render With Docker

Render does not run `docker-compose.yml`, so the hostname `postgres` from local
Docker Compose is not available on Render.

Create a Render PostgreSQL database first, then set this env variable on the
Render API web service:

```env
DATABASE_URL=<Render PostgreSQL Internal Database URL>
```

Do not use this local Docker Compose URL on Render:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/g_scores?schema=public
```

Recommended Render API env:

```env
DATABASE_URL=<Render PostgreSQL Internal Database URL>
CORS_ORIGIN=<your frontend URL>
RUN_SEED_ON_START=false
```

The Dockerfile only runs `db:seed` when `RUN_SEED_ON_START=true`. This keeps the
Render deploy from failing because Render does not mount the local
`./dataset` directory into the container.

To import data into Render PostgreSQL, run the seed once from your local
machine using the Render PostgreSQL External Database URL:

```powershell
cd g-scores-api
$env:DATABASE_URL="<Render PostgreSQL External Database URL>"
$env:SEED_FILE="../dataset/diem_thi_thpt_2024.csv"
npm run db:deploy
npm run db:seed
```

## Run Locally

Install dependencies:

```bash
npm install
```

Create a local env file:

```bash
cp .env.example .env
```

Example local env:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/g_scores?schema=public
CORS_ORIGIN=http://localhost:5173
PORT=5000
SEED_FILE=../dataset/diem_thi_thpt_2024.csv
SEED_BATCH_SIZE=2000
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Run migrations:

```bash
npm run db:migrate
```

Seed the database:

```bash
npm run db:seed
```

Start the API in watch mode:

```bash
npm run start:dev
```

The local API URL depends on `PORT` in `.env`. With the example above:

```text
http://localhost:5000
```

## Database Seeding

The seed script reads the CSV file from `SEED_FILE` and imports rows in batches.

Useful env variables:

```text
SEED_FILE         Path to the CSV file
SEED_BATCH_SIZE   Number of rows inserted per batch
SEED_RESET=true   Delete existing score rows before importing
SEED_FORCE=true   Import even if score rows already exist
```

Examples:

```bash
npm run db:seed
```

Reset and import again:

```bash
SEED_RESET=true npm run db:seed
```

With Docker Compose:

```bash
docker compose exec -e SEED_RESET=true api npm run db:seed
```

## API Endpoints

```text
GET /                              Health check
GET /scores/:sbd                   Find scores by 8-digit registration number
GET /reports/score-levels          Score distribution by subject
GET /reports/top-group-a?limit=10  Top Group A students
```

## Scripts

```text
npm run build            Build the API
npm run start:dev        Start the API in watch mode
npm run start:prod       Start the compiled API
npm run prisma:generate  Generate Prisma client
npm run db:migrate       Run Prisma migrate dev
npm run db:deploy        Deploy migrations in production/Docker
npm run db:seed          Import CSV data into PostgreSQL
npm test                 Run unit tests
npm run test:e2e         Run e2e tests
npm run lint             Run ESLint with auto-fix
```

## Test

```bash
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run build
```

## Project Structure

```text
prisma/
  migrations/       Database migrations
  schema.prisma     Prisma schema
  seed.ts           CSV import script
src/
  prisma/           Prisma service/module
  scores/           Score lookup endpoint
  reports/          Reporting endpoints
  subjects/         Subject metadata registry
test/               E2E tests
```

## Troubleshooting

If Docker reports that port `5432` or `5000` is already allocated, stop the old
container using that port or change the host port in `docker-compose.yml`.

If the API starts with an empty database, check that the dataset is mounted:

```bash
docker compose exec api ls /dataset
docker compose exec api printenv SEED_FILE
```

If the seed file is missing, make sure this file exists from the repository
root:

```text
dataset/diem_thi_thpt_2024.csv
```
