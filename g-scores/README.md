# G-Scores Web

React frontend for the G-Scores project. The app lets users search exam scores
by registration number, view score distribution charts, and inspect the top
Group A students.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Recharts
- lucide-react

## Prerequisites

- Node.js 24 or newer
- npm
- A running G-Scores API

## Run With Docker Compose

The recommended Docker flow is from the repository root:

```bash
docker compose up -d --build
```

The web app will be available at:

```text
http://localhost:5173
```

In Docker Compose, the frontend is built with:

```text
VITE_API_URL=http://localhost:5000
```

This URL is used by the browser, so it must point to the API port exposed on
your host machine.

## Run Locally

Install dependencies:

```bash
npm install
```

Create a local env file:

```bash
cp .env.example .env
```

Set the API URL in `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview -- --host 0.0.0.0 --port 5173
```

## Scripts

```text
npm run dev      Start the Vite dev server
npm run build    Type-check and build the production bundle
npm run lint     Run ESLint
npm run preview  Preview the production bundle
```

## Project Structure

```text
src/
  components/  Page sections and reusable UI blocks
  constants/   Static UI constants
  hooks/       Data loading and search state
  services/    API client functions
  types/       Shared frontend TypeScript types
  utils/       Formatting helpers
```

## Notes

- Vite environment variables are injected at build time. If `VITE_API_URL`
  changes for the Docker image, rebuild the web image.
- The API must allow CORS from `http://localhost:5173`.
- The web container does not connect directly to PostgreSQL. It only talks to
  the API.
