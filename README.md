# twinge.

Personal health tracking MVP based on `twinge-prd.md`.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173/`.

## Mobile apps

The repo includes Capacitor native shells for Android and iOS.

```bash
npm run mobile:sync
```

Android:

```bash
npm run mobile:android
```

Or build an APK from the native folder:

```bash
cd android
./gradlew assembleDebug
```

iOS:

```bash
npx cap open ios
```

Android builds require a local JDK and Android SDK. iOS builds require macOS with Xcode.

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
- PWA install support plus Capacitor Android/iOS shells

Data currently persists in browser `localStorage`. The PRD backend stack is the natural next milestone: Express API, Prisma schema, PostgreSQL persistence, JWT auth, and CSV export.
