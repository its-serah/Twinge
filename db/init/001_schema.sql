create extension if not exists pgcrypto;

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text,
  created_at timestamptz not null default now()
);

create table profiles (
  user_id uuid primary key references users(id) on delete cascade,
  name text not null default '',
  weight numeric,
  height numeric,
  fat_mass numeric,
  lean_mass numeric,
  water_mass numeric,
  calorie_goal int not null default 2100,
  step_goal int not null default 10000,
  water_goal int not null default 8,
  water_unit text not null default 'glasses' check (water_unit in ('glasses', 'ml')),
  goal text not null default 'Improve energy' check (goal in ('Lose weight', 'Maintain', 'Gain muscle', 'Improve energy')),
  food_setup_done boolean not null default false,
  workout_types text[] not null default array['Leg day','Push day','Pull day','Full body','Cardio','Yoga'],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table food_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  calories int not null default 0 check (calories >= 0),
  protein numeric not null default 0 check (protein >= 0),
  fiber numeric not null default 0 check (fiber >= 0),
  times_logged int not null default 0 check (times_logged >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  food_item_id uuid references food_items(id) on delete set null,
  name text not null,
  calories int not null default 0 check (calories >= 0),
  protein numeric not null default 0 check (protein >= 0),
  fiber numeric not null default 0 check (fiber >= 0),
  meal_tag text not null check (meal_tag in ('Breakfast', 'Lunch', 'Dinner', 'Snacks')),
  logged_at timestamptz not null default now()
);

create table water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  amount_ml int not null check (amount_ml > 0),
  logged_at timestamptz not null default now()
);

create table workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  exercises jsonb not null default '[]'::jsonb,
  duration_minutes int check (duration_minutes is null or duration_minutes >= 0),
  intensity text check (intensity in ('Low', 'Medium', 'High')),
  notes text not null default '',
  logged_at timestamptz not null default now()
);

create table symptom_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('Soreness', 'Tightness', 'Sharp pain', 'Ache', 'Other')),
  severity int not null check (severity between 1 and 10),
  body_location text not null,
  notes text not null default '',
  logged_at timestamptz not null default now()
);

create table mental_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  mood int not null check (mood between 1 and 10),
  energy int not null check (energy between 1 and 10),
  sleep_hours numeric not null check (sleep_hours >= 0),
  water_glasses int not null default 0 check (water_glasses >= 0),
  journal text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create table step_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  step_count int not null default 0 check (step_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create index food_logs_user_logged_at_idx on food_logs (user_id, logged_at desc);
create index water_logs_user_logged_at_idx on water_logs (user_id, logged_at desc);
create index workout_logs_user_logged_at_idx on workout_logs (user_id, logged_at desc);
create index symptom_logs_user_logged_at_idx on symptom_logs (user_id, logged_at desc);
create index mental_logs_user_date_idx on mental_logs (user_id, date desc);
create index step_logs_user_date_idx on step_logs (user_id, date desc);
