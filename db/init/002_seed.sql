insert into users (id, email)
values ('00000000-0000-0000-0000-000000000001', 'demo@twinge.local')
on conflict (email) do nothing;

insert into profiles (
  user_id,
  name,
  weight,
  height,
  fat_mass,
  lean_mass,
  water_mass,
  calorie_goal,
  step_goal,
  water_goal,
  goal,
  food_setup_done
)
values (
  '00000000-0000-0000-0000-000000000001',
  'Serah',
  62,
  165,
  16,
  43,
  34,
  2100,
  10000,
  8,
  'Improve energy',
  false
)
on conflict (user_id) do nothing;

insert into food_items (user_id, name, calories, protein, fiber, times_logged)
values
  ('00000000-0000-0000-0000-000000000001', 'Greek yogurt', 130, 17, 0, 3),
  ('00000000-0000-0000-0000-000000000001', 'Chicken rice bowl', 520, 38, 5, 5),
  ('00000000-0000-0000-0000-000000000001', 'Banana', 105, 1, 3, 8),
  ('00000000-0000-0000-0000-000000000001', 'Protein shake', 180, 28, 1, 4)
on conflict (user_id, name) do nothing;
