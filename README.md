# twinge.

Personal health tracking MVP based on `twinge-prd.md`.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173/`.

## Local Postgres

```bash
docker compose up -d
```

Connection string:

```text
postgresql://twinge:twinge_dev_password@localhost:5432/twinge
```

The schema and demo seed data live in `db/init`. The frontend still uses browser `localStorage`; this database is ready for the next pass when the app gets wired to a backend/API.

## Current build

- React + Vite app shell
- Dashboard cards and 7-day charts
- Food library onboarding, smart matching, manual food logging, daily macro totals
- Water quick-add tracking
- Workout quick-starts and session logging
- Symptom logging with shin and shank shortcuts
- Daily mood, energy, sleep, journal, and step check-in
- Profile metrics, goal editing, BMR/TDEE reference, food library removal
- JSON export
- Basic PWA manifest and service worker

Data currently persists in browser `localStorage`. The PRD backend stack is the natural next milestone: Express API, Prisma schema, PostgreSQL persistence, JWT auth, and CSV export.
