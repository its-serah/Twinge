# twinge. — Product Requirements Document

> *feel it. track it. understand it.*

**Version:** 1.1
**Date:** May 27, 2026
**Platform:** Web (PWA first) → iOS & Android later
**Status:** Draft — ready to build
**Dev:** Solo

---

## 1. Overview

### 1.1 What is Twinge?

Twinge is a personal health tracking web app that lets you log, visualize, and understand your physical and mental wellbeing in one place. Built around the idea that health data should be fast to log, personalized to you, and easy to act on.

### 1.2 Problem

Most health apps are either too generic (no personalization), too fragmented (one app per thing), or too clinical. There's no single lightweight tool that connects food habits, physical symptoms, gym progress, mental state, hydration, and body composition in a unified, learning timeline.

### 1.3 Vision

A single daily companion that learns your habits so logging takes seconds — and helps you connect the dots between what you eat, how you move, and how you feel.

### 1.4 Goals

- Log any health data in under 60 seconds per entry
- Learn user habits over time so suggestions get smarter
- Visualize trends across all tracked dimensions
- Be fully usable as a PWA on mobile browsers from day one
- Be open source and self-hostable on GitHub

---

## 2. Features

### 2.1 Smart Food & Nutrition Log

The food system learns what you eat so logging becomes a single tap after a few sessions.

#### Onboarding food setup
- On first sign-up, user picks their usual foods from a chip grid (names only, not overwhelming)
- These become the user's personal food library
- Each saved food stores: name, calories, protein (g), fiber (g)

#### Daily logging
- Log by meal: Breakfast, Lunch, Dinner, Snacks
- Type a food name — app searches personal library first, then common foods
- If a match is found: show "Same as usual?" popup with saved versions to pick from
- If multiple variants exist (e.g. two different breads): show list of variants, user taps one
- If no match: manual entry form (name, calories, protein, fiber) — auto-saves to library
- Daily totals auto-calculated: calories, protein, fiber
- Calorie goal progress bar on dashboard and food page

#### Food library (in profile)
- View all saved foods with their macros
- Add, edit, or remove foods manually
- Library grows automatically as new foods are logged

| Field | Type | Notes |
|---|---|---|
| Food name | Text | Free text, saved to library |
| Calories | Number | kcal per serving |
| Protein | Number (g) | Optional |
| Fiber | Number (g) | Optional |
| Meal tag | Enum | Breakfast / Lunch / Dinner / Snacks |
| Logged at | Timestamp | Auto or manual override |

---

### 2.2 Water Tracking

- Log water intake in glasses or ml (user sets unit preference)
- Quick-add buttons: +1 glass, +250ml, +500ml
- Daily water goal settable in profile (default: 8 glasses)
- Progress ring or bar shown on dashboard
- Loggable from daily check-in or independently at any time

---

### 2.3 Smart Gym & Workout Tracker

Twinge learns your workout patterns so after a few sessions, logging a gym day is one tap.

#### Onboarding workout setup
- User picks their usual workout types: Leg day, Push day, Pull day, Full body, Cardio, Yoga, HIIT, etc.
- These appear as quick-start cards on the gym page

#### Logging a session
- Tap a workout type (e.g. Leg day) to open session
- Pre-populated exercise chips from that day type — tap to select
- After a few sessions, previously used exercises are pre-selected automatically
- For each exercise: optional sets, reps, and weight (kg)
- Session-level: duration (minutes), intensity (Low / Medium / High), notes
- Multiple sessions per day allowed

#### Custom workouts
- Log any workout not in the preset list via free text
- Saved as a new workout type for future quick-logging

| Field | Type | Notes |
|---|---|---|
| Workout type | Text / Enum | From preset list or custom |
| Exercises | Array | Name, sets, reps, weight per exercise |
| Duration | Number (min) | Optional |
| Intensity | Enum | Low / Medium / High |
| Notes | Text | Optional |
| Logged at | Timestamp | Auto |

---

### 2.4 Symptom & Body Tracker

Log physical symptoms with context, including muscle-specific issues like shin splints and shank soreness.

#### General symptom log
- Symptom name: free text or pick from recent/common list
- Type: Soreness / Tightness / Sharp pain / Ache / Other
- Severity: slider 1–10
- Body location: head, neck, chest, stomach, back, limbs, skin, other
- Notes: optional free text
- Timestamp: auto or manual
- Multiple symptoms per day

#### Muscle & injury tracker (shin / shank focus)
- Dedicated body locations: Shin (front lower leg), Shank / Calf (back lower leg), Knee, Ankle, Thigh, Hip
- Shin splint quick-log shortcut: one-tap entry with pre-filled location
- Pain type selector: soreness / tightness / sharp pain / ache
- Notes for context (e.g. "after leg day", "started mid-run")
- Symptom history chart: see if shin/shank issues correlate with workout days

| Field | Type | Notes |
|---|---|---|
| Symptom name | Text | Free text or from list |
| Type | Enum | Soreness / Tightness / Sharp pain / Ache / Other |
| Severity | Number 1–10 | Slider |
| Body location | Enum | Includes shin, shank, calf, knee, ankle |
| Notes | Text | Optional |
| Logged at | Timestamp | Auto |

---

### 2.5 Mental Health & Daily Check-in

- Mood: emoji scale 1–10 (1 = very low, 10 = excellent)
- Energy: slider 1–10
- Hours slept: decimal input (e.g. 7.5)
- Water glasses: synced with water tracker
- Journal: optional free text, no character limit, private
- One check-in per day, editable until midnight
- Weekly history shown as cards: mood emoji + sleep + energy summary

---

### 2.6 Step Counter

- Manual daily step entry (device auto-sync in v2)
- Daily step goal settable in profile (default: 10,000)
- 7-day bar chart on dashboard
- Streak indicator when goal is met
- One entry per day, editable

---

### 2.7 Profile & Body Metrics

- Name, weight (kg), height (cm)
- Body composition: fat mass (kg or %), lean/muscle mass (kg), water mass (kg or %)
- Daily calorie goal, step goal, water goal
- Health goal: Lose weight / Maintain / Gain muscle / Improve energy
- BMR / TDEE auto-calculated from weight, height, and goal (shown as reference)
- All fields editable at any time

---

### 2.8 Dashboard

- Metric cards: calories, steps, mood, sleep, water
- Progress bars: calorie goal, step goal, water goal
- 7-day trend charts: steps, mood, energy, sleep
- Quick-log buttons for all modules
- Logging streak indicator
- Symptom summary if anything logged today

---

### 2.9 Auth & Data Export

- Email + password sign-up and login
- Password reset via email
- JWT-based sessions
- Export all data as JSON or CSV from profile page

---

## 3. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React + Vite | Fast dev, component-based |
| Styling | Tailwind CSS | Utility-first, mobile-friendly |
| Charts | Recharts | Lightweight, React-native |
| Backend | Node.js + Express | Simple REST API |
| Database | PostgreSQL | Great for time-series logs |
| ORM | Prisma | Type-safe, excellent DX |
| Auth | JWT + bcrypt | No third-party dependency |
| Hosting | Railway or Render | Free tier, easy solo deploy |
| PWA | Vite PWA plugin | Service worker + manifest |

---

## 4. Data Models

### User
```
id, email, passwordHash,
profile: { weight, height, fatMass, waterMass, calGoal, stepGoal, waterGoal, goal },
createdAt
```

### FoodItem (library)
```
id, userId, name, calories, protein, fiber, timesLogged
```

### FoodLog
```
id, userId, foodItemId (nullable), name, calories, protein, fiber,
mealTag (Breakfast/Lunch/Dinner/Snacks), loggedAt
```

### SymptomLog
```
id, userId, name, type (soreness/tightness/sharp_pain/ache/other),
severity (1–10), bodyLocation, notes, loggedAt
```

### WorkoutLog
```
id, userId, type, exercises ([{name, sets, reps, weight}]),
durationMinutes, intensity (low/medium/high), notes, loggedAt
```

### MentalHealthLog
```
id, userId, mood (1–10), energy (1–10), sleepHours,
waterGlasses, journal, date (unique per user)
```

### StepLog
```
id, userId, stepCount, date (unique per user)
```

---

## 5. API Routes

All routes prefixed `/api/v1/` and JWT-protected except auth.

```
POST   /auth/register
POST   /auth/login
POST   /auth/reset-password

GET    /profile
PUT    /profile

GET    /food/library
POST   /food/library

GET    /logs/food
POST   /logs/food
DELETE /logs/food/:id

GET    /logs/symptoms
POST   /logs/symptoms
DELETE /logs/symptoms/:id

GET    /logs/workout
POST   /logs/workout

GET    /logs/mental
POST   /logs/mental
PUT    /logs/mental/:date

GET    /logs/steps
POST   /logs/steps

GET    /dashboard/summary
GET    /dashboard/trends?days=7

GET    /export/json
GET    /export/csv
```

---

## 6. Milestones

| # | What | When |
|---|---|---|
| 1 — Foundation | Repo, React + Vite, Tailwind, Express, Prisma, PostgreSQL, JWT auth | Week 1 |
| 2 — Food system | Food library, onboarding chip picker, smart log with confirm modal, daily totals | Week 2 |
| 3 — Body & symptoms | Symptom log, shin/shank locations, pain types, water tracker | Week 2–3 |
| 4 — Gym tracker | Workout onboarding, exercise chips, sets/reps/weight, session log | Week 3 |
| 5 — Mind & steps | Mental check-in, mood scale, journal, step counter, streak | Week 4 |
| 6 — Dashboard | Summary cards, progress bars, 7-day charts, quick-log buttons | Week 4–5 |
| 7 — Profile | Body metrics, food library management, export | Week 5 |
| 8 — Polish & ship | PWA, responsive QA, deploy to Railway/Render, README + GitHub | Week 6 |

---

## 7. Out of Scope (v1)

- Native iOS / Android apps
- Wearable / device sync (Apple Health, Google Fit)
- Barcode scanning or external food databases
- Social features
- AI-generated insights
- Push notifications
- Offline mode beyond basic PWA caching

---

## 8. Future Roadmap

| Version | Features |
|---|---|
| v1.5 | OpenFoodFacts integration, barcode scanning |
| v2.0 | Native iOS + Android, wearable sync, push reminders |
| v2.5 | AI pattern insights (e.g. "Your shin pain follows high-intensity leg days") |
| v3.0 | Healthcare provider export, period / hormone tracking |

---

## 9. Open Questions

- Should calorie goal be a hard cap with a warning, or a soft visual reference?
- Default chart window: 7 days or 30 days?
- Should journal entries be searchable in v1?
- Water: glasses or ml input — or let the user choose?
- Shin/shank: dedicated "injury log" mode or keep unified with general symptoms?

---

*twinge — feel it. track it. understand it.*
