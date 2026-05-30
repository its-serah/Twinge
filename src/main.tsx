import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Apple,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  Dumbbell,
  Droplets,
  Download,
  Flame,
  HeartPulse,
  Pencil,
  Plus,
  Settings,
  Footprints,
  Sparkles,
  Trash2,
  Utensils,
  Wand2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { lastDays, shortDay, todayKey, uid } from "./lib/date";
import { exportJson, loadData, saveData } from "./lib/storage";
import { AppData, FoodItem, FoodLog, HealthGoal, Intensity, MealTag, SymptomType } from "./lib/types";
import "./styles/app.css";

const meals: MealTag[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];
const symptomTypes: SymptomType[] = ["Soreness", "Tightness", "Sharp pain", "Ache", "Other"];
const locations = ["Shin", "Shank / Calf", "Knee", "Ankle", "Thigh", "Hip", "Back", "Stomach", "Head", "Other"];
const intensities: Intensity[] = ["Low", "Medium", "High"];
const goals: HealthGoal[] = ["Lose weight", "Maintain", "Gain muscle", "Improve energy"];
const starterFoods = ["Eggs", "Greek yogurt", "Banana", "Oats", "Chicken rice bowl", "Salmon", "Avocado toast", "Protein shake"];
const navItems = ["Today", "Dashboard", "Food", "Gym", "Symptoms", "Check-in", "Profile"];
const commonFoods: FoodItem[] = [
  { id: "common_apple", name: "Apple", calories: 95, protein: 0, fiber: 4, timesLogged: 0 },
  { id: "common_eggs", name: "Eggs", calories: 140, protein: 12, fiber: 0, timesLogged: 0 },
  { id: "common_oats", name: "Oats", calories: 300, protein: 10, fiber: 8, timesLogged: 0 },
];

function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [active, setActive] = useState("Today");
  const [stage, setStage] = useState<"landing" | "onboarding" | "app">("landing");

  useEffect(() => saveData(data), [data]);

  const today = todayKey();
  const todayFoods = data.foodLogs.filter((log) => log.loggedAt.startsWith(today));
  const todayWaterMl = data.waterLogs.filter((log) => log.loggedAt.startsWith(today)).reduce((sum, log) => sum + log.amountMl, 0);
  const todayMental = data.mentalLogs.find((log) => log.date === today);
  const todaySteps = data.stepLogs.find((log) => log.date === today)?.stepCount ?? 0;
  const totals = {
    calories: todayFoods.reduce((sum, item) => sum + item.calories, 0),
    protein: todayFoods.reduce((sum, item) => sum + item.protein, 0),
    fiber: todayFoods.reduce((sum, item) => sum + item.fiber, 0),
  };
  const waterGlasses = Math.round(todayWaterMl / 250);

  const trends = useMemo(() => {
    return lastDays(7).map((date) => {
      const foods = data.foodLogs.filter((log) => log.loggedAt.startsWith(date));
      const mental = data.mentalLogs.find((log) => log.date === date);
      return {
        date,
        day: shortDay(date),
        steps: data.stepLogs.find((log) => log.date === date)?.stepCount ?? 0,
        mood: mental?.mood ?? 0,
        energy: mental?.energy ?? 0,
        sleep: mental?.sleepHours ?? 0,
        calories: foods.reduce((sum, item) => sum + item.calories, 0),
      };
    });
  }, [data]);

  const setProfile = (patch: Partial<AppData["profile"]>) => {
    setData((current) => ({ ...current, profile: { ...current.profile, ...patch } }));
  };

  if (stage === "landing") {
    return <LandingPage onEnter={() => setStage("onboarding")} />;
  }

  if (stage === "onboarding") {
    return <OnboardingPage data={data} setData={setData} onDone={() => setStage("app")} />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><HeartPulse size={20} /></div>
          <div>
            <strong>twinge.</strong>
            <span>feel it. track it.</span>
          </div>
        </div>
        {navItems.map((item) => (
          <button className={active === item ? "nav active" : "nav"} key={item} onClick={() => setActive(item)}>
            {navIcon(item)}
            <span>{item}</span>
          </button>
        ))}
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</p>
            <h1>{active === "Today" ? `Hey ${data.profile.name || "Sarah"}, what are we eating?` : active === "Dashboard" ? `Hi ${data.profile.name || "there"}, here's your body board.` : active}</h1>
          </div>
          <div className="top-actions">
            <span className="status-pill"><Flame size={15} /> {totals.calories}/{data.profile.calorieGoal}</span>
            <span className="status-pill"><Droplets size={15} /> {waterGlasses}/{data.profile.waterGoal}</span>
            <button className="button ghost" onClick={() => exportJson(data)}>
              <Download size={17} /> Export
            </button>
          </div>
        </header>

        {active === "Today" && <TodayPage data={data} setData={setData} setActive={setActive} />}
        {active === "Dashboard" && (
          <Dashboard
            data={data}
            totals={totals}
            todayWaterMl={todayWaterMl}
            todaySteps={todaySteps}
            todayMental={todayMental}
            trends={trends}
            setActive={setActive}
            addWater={(amountMl) => setData((current) => ({ ...current, waterLogs: [...current.waterLogs, { id: uid("water"), amountMl, loggedAt: new Date().toISOString() }] }))}
          />
        )}
        {active === "Food" && <FoodPage data={data} setData={setData} totals={totals} />}
        {active === "Gym" && <GymPage data={data} setData={setData} />}
        {active === "Symptoms" && <SymptomsPage data={data} setData={setData} />}
        {active === "Check-in" && <CheckInPage data={data} setData={setData} todayWaterMl={todayWaterMl} />}
        {active === "Profile" && <ProfilePage data={data} setData={setData} setProfile={setProfile} />}
      </main>
    </div>
  );
}


function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <main className="landing">
      <section className="landing-card">
        <div className="landing-mark"><HeartPulse size={30} /></div>
        <p className="eyebrow">feel it. track it. understand it.</p>
        <h1>twinge.</h1>
        <p className="landing-copy">A soft little home for food, water, workouts, symptoms, mood, and the patterns your body keeps trying to tell you.</p>
        <div className="landing-actions">
          <button className="button landing-button" onClick={onEnter}>Sign up <ArrowRight size={18} /></button>
          <button className="button ghost landing-button" onClick={onEnter}>Continue <ArrowRight size={18} /></button>
        </div>
      </section>
    </main>
  );
}

function OnboardingPage({ data, setData, onDone }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; onDone: () => void }) {
  const [name, setName] = useState(data.profile.name || "Sarah");
  const [calorieGoal, setCalorieGoal] = useState(data.profile.calorieGoal);
  const [waterGoal, setWaterGoal] = useState(data.profile.waterGoal);
  const [selectedFoods, setSelectedFoods] = useState<string[]>(data.foodLibrary.map((food) => food.name));

  const toggleFood = (food: string) => {
    setSelectedFoods((current) => current.includes(food) ? current.filter((item) => item !== food) : [...current, food]);
  };

  const finish = (event: FormEvent) => {
    event.preventDefault();
    setData((current) => {
      const existing = new Set(current.foodLibrary.map((food) => food.name.toLowerCase()));
      const additions = selectedFoods
        .filter((food) => !existing.has(food.toLowerCase()))
        .map((food) => ({ id: uid("food"), name: food, calories: 0, protein: 0, fiber: 0, timesLogged: 0 }));

      return {
        ...current,
        profile: {
          ...current.profile,
          name,
          calorieGoal,
          waterGoal,
          foodSetupDone: true,
        },
        foodLibrary: [...current.foodLibrary, ...additions],
      };
    });
    onDone();
  };

  return (
    <main className="onboarding-shell">
      <form className="onboarding-card" onSubmit={finish}>
        <p className="eyebrow">Set your tiny daily base</p>
        <h1>Let twinge learn your usuals.</h1>
        <div className="onboarding-grid">
          <label>Name<input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>Calorie goal<input type="number" value={calorieGoal} onChange={(event) => setCalorieGoal(Number(event.target.value))} /></label>
          <label>Water goal<input type="number" value={waterGoal} onChange={(event) => setWaterGoal(Number(event.target.value))} /></label>
        </div>
        <div>
          <h2><Apple size={18} /> Usual foods</h2>
          <div className="onboarding-foods">
            {starterFoods.map((food) => (
              <button type="button" key={food} className={selectedFoods.includes(food) ? "onboarding-chip active" : "onboarding-chip"} onClick={() => toggleFood(food)}>
                {selectedFoods.includes(food) && <CheckCircle2 size={16} />}
                {food}
              </button>
            ))}
          </div>
        </div>
        <button className="button onboarding-submit">Start logging <ArrowRight size={18} /></button>
      </form>
    </main>
  );
}

function TodayPage({ data, setData, setActive }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; setActive: (tab: string) => void }) {
  const suggestedMeal = mealForNow();
  const lastFood = data.foodLogs.slice().reverse()[0];
  const todayFoodLogs = data.foodLogs.filter((log) => log.loggedAt.startsWith(todayKey())).slice().reverse();
  const [meal, setMeal] = useState<MealTag>((lastFood?.mealTag ?? suggestedMeal) as MealTag);
  const [query, setQuery] = useState("");
  const [manual, setManual] = useState({ calories: 0, protein: 0, fiber: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const matches = [...data.foodLibrary, ...commonFoods].filter((food) => food.name.toLowerCase().includes(query.toLowerCase()) && query.trim());
  const frequentFoods = data.foodLibrary.slice().sort((a, b) => b.timesLogged - a.timesLogged).slice(0, 6);

  const clearForm = () => {
    setQuery("");
    setManual({ calories: 0, protein: 0, fiber: 0 });
    setEditingId(null);
  };

  const logFood = (food: FoodItem) => {
    if (editingId) {
      setData((current) => ({
        ...current,
        foodLogs: current.foodLogs.map((log) => log.id === editingId ? { ...log, name: food.name, calories: food.calories, protein: food.protein, fiber: food.fiber, mealTag: meal } : log),
      }));
      setConfirmation(`Updated ${food.name} in ${meal}.`);
      clearForm();
      return;
    }

    setData((current) => {
      const library = current.foodLibrary.some((item) => item.name.toLowerCase() === food.name.toLowerCase())
        ? current.foodLibrary.map((item) => item.name.toLowerCase() === food.name.toLowerCase() ? { ...item, timesLogged: item.timesLogged + 1 } : item)
        : [...current.foodLibrary, { ...food, id: uid("food"), timesLogged: 1 }];

      return {
        ...current,
        foodLibrary: library,
        foodLogs: [...current.foodLogs, { ...food, id: uid("log"), mealTag: meal, loggedAt: new Date().toISOString() }],
      };
    });
    setConfirmation(`Added ${food.name} to ${meal}.`);
    clearForm();
  };

  const submitManual = (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    logFood({ id: uid("food"), name: query.trim(), calories: manual.calories, protein: manual.protein, fiber: manual.fiber, timesLogged: 0 });
  };

  const editFoodLog = (log: FoodLog) => {
    setEditingId(log.id);
    setMeal(log.mealTag);
    setQuery(log.name);
    setManual({ calories: log.calories, protein: log.protein, fiber: log.fiber });
    setConfirmation(`Editing ${log.name}. Save it back to ${log.mealTag}.`);
  };

  const deleteFoodLog = (id: string) => {
    setData((current) => ({ ...current, foodLogs: current.foodLogs.filter((log) => log.id !== id) }));
    setConfirmation("Removed that food from today.");
    if (editingId === id) clearForm();
  };

  return (
    <section className="today-flow">
      <article className="today-hero">
        <div>
          <p className="eyebrow">Quick food journey</p>
          <h2>What are you eating right now?</h2>
          <p>Twinge starts with the meal that makes sense for the time of day, but you can switch it before saving.</p>
        </div>
        <div className="meal-suggestion">
          <Clock size={18} />
          <span>Suggested meal</span>
          <strong>{suggestedMeal}</strong>
        </div>
      </article>

      {confirmation && <div className="added-toast"><CheckCircle2 size={18} /> {confirmation}</div>}

      <div className="meal-picker">
        {meals.map((item) => (
          <button key={item} className={meal === item ? "meal-chip active" : "meal-chip"} onClick={() => setMeal(item)}>
            {item}
          </button>
        ))}
      </div>

      <section className="grid two">
        <Panel title={editingId ? "Edit food" : "Add food"} icon={<Utensils size={18} />}>
          <form className="form" onSubmit={submitManual}>
            <label>Search or type food<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Greek yogurt, banana, chicken bowl..." /></label>
            {matches.length > 0 && <div className="match-box">{matches.slice(0, 5).map((food) => <button type="button" key={food.id} onClick={() => logFood(food)}>Use {food.name} · {food.calories} kcal</button>)}</div>}
            <div className="row">
              <label>Calories<input type="number" value={manual.calories} onChange={(event) => setManual({ ...manual, calories: Number(event.target.value) })} /></label>
              <label>Protein<input type="number" value={manual.protein} onChange={(event) => setManual({ ...manual, protein: Number(event.target.value) })} /></label>
              <label>Fiber<input type="number" value={manual.fiber} onChange={(event) => setManual({ ...manual, fiber: Number(event.target.value) })} /></label>
            </div>
            <div className="form-actions">
              <button className="button"><Plus size={17} /> {editingId ? "Save food" : `Add to ${meal}`}</button>
              {editingId && <button type="button" className="button ghost" onClick={clearForm}>Cancel</button>}
            </div>
          </form>
        </Panel>

        <Panel title="Usuals & last logged" icon={<Sparkles size={18} />}>
          {lastFood && <button className="last-meal" onClick={() => logFood(lastFood)}>Repeat last: {lastFood.name}<small>{lastFood.mealTag} · {lastFood.calories} kcal</small></button>}
          <div className="usual-grid">
            {frequentFoods.map((food) => (
              <button key={food.id} onClick={() => logFood(food)}>
                <strong>{food.name}</strong>
                <small>{food.calories} kcal · {food.protein}g protein</small>
              </button>
            ))}
          </div>
          <button className="button ghost" onClick={() => setActive("Dashboard")}>View dashboard <ArrowRight size={17} /></button>
        </Panel>
      </section>

      <Panel title="Today's food" icon={<Apple size={18} />}>
        <div className="today-food-list">
          {todayFoodLogs.length ? todayFoodLogs.map((log) => (
            <article key={log.id} className="logged-food">
              <div>
                <strong>{log.name}</strong>
                <small>{log.mealTag} · {log.calories} kcal · {log.protein}g protein · {log.fiber}g fiber</small>
              </div>
              <div className="food-actions">
                <button aria-label={`Edit ${log.name}`} onClick={() => editFoodLog(log)}><Pencil size={16} /></button>
                <button aria-label={`Delete ${log.name}`} onClick={() => deleteFoodLog(log.id)}><Trash2 size={16} /></button>
              </div>
            </article>
          )) : <p className="empty-note">Nothing logged yet. Add the first thing you ate today.</p>}
        </div>
      </Panel>
    </section>
  );
}

function Dashboard(props: {
  data: AppData;
  totals: { calories: number; protein: number; fiber: number };
  todayWaterMl: number;
  todaySteps: number;
  todayMental?: { mood: number; energy: number; sleepHours: number };
  trends: Array<Record<string, string | number>>;
  setActive: (tab: string) => void;
  addWater: (amountMl: number) => void;
}) {
  const { data, totals, todayWaterMl, todaySteps, todayMental, trends } = props;
  const waterGlasses = Math.round(todayWaterMl / 250);
  const symptoms = data.symptomLogs.filter((log) => log.loggedAt.startsWith(todayKey()));
  const streak = lastDays(7).filter((date) => (data.stepLogs.find((log) => log.date === date)?.stepCount ?? 0) >= data.profile.stepGoal).length;
  const readiness = Math.round((((todayMental?.mood ?? 5) + (todayMental?.energy ?? 5)) / 20) * 100);
  const journey = [
    { label: "Check in", detail: todayMental ? `${todayMental.mood}/10 mood` : "Mood, energy, sleep", done: Boolean(todayMental), action: "Check-in", icon: <Brain size={18} /> },
    { label: "Fuel", detail: `${totals.calories} kcal logged`, done: totals.calories > 0, action: "Food", icon: <Apple size={18} /> },
    { label: "Hydrate", detail: `${waterGlasses}/${data.profile.waterGoal} glasses`, done: waterGlasses >= data.profile.waterGoal, action: "Dashboard", icon: <Droplets size={18} /> },
    { label: "Move", detail: `${todaySteps.toLocaleString()} steps`, done: todaySteps >= data.profile.stepGoal, action: "Gym", icon: <Footprints size={18} /> },
  ];

  return (
    <section className="stack">
      <div className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Your gentle health loop</p>
          <h2>{readiness}% glow score</h2>
          <p>Start with a check-in, log what matters, then watch your daily rhythm come together.</p>
          <div className="hero-tags">
            <span>{totals.protein}g protein</span>
            <span>{totals.fiber}g fiber</span>
            <span>{symptoms.length} symptoms</span>
          </div>
        </div>
        <div className="readiness-dial" style={{ ["--score" as string]: `${readiness}%` }}>
          <strong>{moodEmoji(todayMental?.mood ?? 5)}</strong>
          <span>{todayMental?.sleepHours ?? 0}h sleep</span>
        </div>
      </div>

      <div className="journey">
        {journey.map((step, index) => (
          <button key={step.label} className={step.done ? "journey-step done" : "journey-step"} onClick={() => step.action === "Dashboard" ? props.addWater(250) : props.setActive(step.action)}>
            <span className="journey-number">{step.done ? <CheckCircle2 size={18} /> : index + 1}</span>
            <span className="journey-icon">{step.icon}</span>
            <strong>{step.label}</strong>
            <small>{step.detail}</small>
          </button>
        ))}
      </div>

      <div className="metrics">
        <Metric icon={<Flame />} label="Calories" value={`${totals.calories}`} detail={`${data.profile.calorieGoal} kcal goal`} progress={totals.calories / data.profile.calorieGoal} />
        <Metric icon={<Footprints />} label="Steps" value={todaySteps.toLocaleString()} detail={`${streak} goal days this week`} progress={todaySteps / data.profile.stepGoal} />
        <Metric icon={<Droplets />} label="Water" value={`${waterGlasses}/${data.profile.waterGoal}`} detail={`${todayWaterMl} ml logged`} progress={waterGlasses / data.profile.waterGoal} />
        <Metric icon={<Brain />} label="Mood" value={todayMental ? `${moodEmoji(todayMental.mood)} ${todayMental.mood}/10` : "No check-in"} detail={`${todayMental?.sleepHours ?? 0}h sleep`} progress={(todayMental?.mood ?? 0) / 10} />
      </div>

      <div className="quick-strip">
        <button onClick={() => props.setActive("Food")}><Apple size={18} /> Food</button>
        <button onClick={() => props.addWater(250)}><Droplets size={18} /> +250ml</button>
        <button onClick={() => props.setActive("Gym")}><Dumbbell size={18} /> Workout</button>
        <button onClick={() => props.setActive("Symptoms")}><Wand2 size={18} /> Symptom</button>
      </div>

      <div className="grid two">
        <Panel title="7-day movement" icon={<BarChart3 size={18} />}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="steps" fill="#20706b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Mood, energy, sleep" icon={<Sparkles size={18} />}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line dataKey="mood" stroke="#b14e2f" strokeWidth={3} />
              <Line dataKey="energy" stroke="#20706b" strokeWidth={3} />
              <Line dataKey="sleep" stroke="#514c8f" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {symptoms.length > 0 && (
        <Panel title="Today's symptom notes" icon={<HeartPulse size={18} />}>
          <div className="inline-list">
            {symptoms.map((symptom) => (
              <span key={symptom.id}>{symptom.bodyLocation}: {symptom.type.toLowerCase()} {symptom.severity}/10</span>
            ))}
          </div>
        </Panel>
      )}
    </section>
  );
}

function FoodPage({ data, setData, totals }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; totals: { calories: number; protein: number; fiber: number } }) {
  const [query, setQuery] = useState("");
  const [meal, setMeal] = useState<MealTag>("Breakfast");
  const [manual, setManual] = useState({ calories: 0, protein: 0, fiber: 0 });
  const matches = [...data.foodLibrary, ...commonFoods].filter((food) => food.name.toLowerCase().includes(query.toLowerCase()) && query.trim());

  const logFood = (food: FoodItem) => {
    setData((current) => {
      const library = current.foodLibrary.some((item) => item.name.toLowerCase() === food.name.toLowerCase())
        ? current.foodLibrary.map((item) => item.name.toLowerCase() === food.name.toLowerCase() ? { ...item, timesLogged: item.timesLogged + 1 } : item)
        : [...current.foodLibrary, { ...food, id: uid("food"), timesLogged: 1 }];
      return { ...current, foodLibrary: library, foodLogs: [...current.foodLogs, { ...food, id: uid("log"), mealTag: meal, loggedAt: new Date().toISOString() }] };
    });
    setQuery("");
  };

  const submitManual = (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    logFood({ id: uid("food"), name: query.trim(), calories: manual.calories, protein: manual.protein, fiber: manual.fiber, timesLogged: 0 });
    setManual({ calories: 0, protein: 0, fiber: 0 });
  };

  return (
    <section className="grid two">
      <Panel title="Smart food log" icon={<Apple size={18} />}>
        {!data.profile.foodSetupDone && (
          <div className="setup">
            <p>Pick usual foods to seed your personal library.</p>
            <div className="chips">
              {starterFoods.map((food) => (
                <button key={food} onClick={() => !data.foodLibrary.some((item) => item.name === food) && setData((current) => ({ ...current, foodLibrary: [...current.foodLibrary, { id: uid("food"), name: food, calories: 0, protein: 0, fiber: 0, timesLogged: 0 }] }))}>{food}</button>
              ))}
            </div>
            <button className="button" onClick={() => setData((current) => ({ ...current, profile: { ...current.profile, foodSetupDone: true } }))}>Done</button>
          </div>
        )}
        <form className="form" onSubmit={submitManual}>
          <label>Meal<select value={meal} onChange={(event) => setMeal(event.target.value as MealTag)}>{meals.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Food name<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a food" /></label>
          {matches.length > 0 && <div className="match-box">{matches.slice(0, 5).map((food) => <button type="button" key={food.id} onClick={() => logFood(food)}>Same as usual? {food.name} · {food.calories} kcal</button>)}</div>}
          <div className="row">
            <label>Calories<input type="number" value={manual.calories} onChange={(event) => setManual({ ...manual, calories: Number(event.target.value) })} /></label>
            <label>Protein<input type="number" value={manual.protein} onChange={(event) => setManual({ ...manual, protein: Number(event.target.value) })} /></label>
            <label>Fiber<input type="number" value={manual.fiber} onChange={(event) => setManual({ ...manual, fiber: Number(event.target.value) })} /></label>
          </div>
          <button className="button"><Plus size={17} /> Log food</button>
        </form>
      </Panel>
      <Panel title="Today & library" icon={<Flame size={18} />}>
        <div className="totals"><strong>{totals.calories}</strong><span>kcal</span><strong>{totals.protein}g</strong><span>protein</span><strong>{totals.fiber}g</strong><span>fiber</span></div>
        <Progress value={totals.calories / data.profile.calorieGoal} />
        <List items={data.foodLogs.filter((log) => log.loggedAt.startsWith(todayKey())).map((log) => `${log.mealTag}: ${log.name} · ${log.calories} kcal`)} />
        <h3>Food library</h3>
        <div className="library">{data.foodLibrary.map((item) => <span key={item.id}>{item.name}<small>{item.calories} kcal · {item.protein}p · {item.fiber}f</small></span>)}</div>
      </Panel>
    </section>
  );
}

function GymPage({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const [type, setType] = useState(data.profile.workoutTypes[0] ?? "Workout");
  const [exercise, setExercise] = useState("Squat");
  const [form, setForm] = useState({ durationMinutes: 45, intensity: "Medium" as Intensity, notes: "", sets: 3, reps: 10, weight: 0 });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setData((current) => ({
      ...current,
      profile: current.profile.workoutTypes.includes(type) ? current.profile : { ...current.profile, workoutTypes: [...current.profile.workoutTypes, type] },
      workoutLogs: [...current.workoutLogs, { id: uid("workout"), type, exercises: [{ name: exercise, sets: form.sets, reps: form.reps, weight: form.weight }], durationMinutes: form.durationMinutes, intensity: form.intensity, notes: form.notes, loggedAt: new Date().toISOString() }],
    }));
  };

  return (
    <section className="grid two">
      <Panel title="Quick-start workout" icon={<Dumbbell size={18} />}>
        <div className="cards">{data.profile.workoutTypes.map((item) => <button className={type === item ? "mini-card active" : "mini-card"} key={item} onClick={() => setType(item)}>{item}</button>)}</div>
        <form className="form" onSubmit={submit}>
          <label>Workout type<input value={type} onChange={(event) => setType(event.target.value)} /></label>
          <label>Exercise<input value={exercise} onChange={(event) => setExercise(event.target.value)} /></label>
          <div className="row"><label>Sets<input type="number" value={form.sets} onChange={(event) => setForm({ ...form, sets: Number(event.target.value) })} /></label><label>Reps<input type="number" value={form.reps} onChange={(event) => setForm({ ...form, reps: Number(event.target.value) })} /></label><label>Kg<input type="number" value={form.weight} onChange={(event) => setForm({ ...form, weight: Number(event.target.value) })} /></label></div>
          <div className="row"><label>Minutes<input type="number" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: Number(event.target.value) })} /></label><label>Intensity<select value={form.intensity} onChange={(event) => setForm({ ...form, intensity: event.target.value as Intensity })}>{intensities.map((item) => <option key={item}>{item}</option>)}</select></label></div>
          <label>Notes<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
          <button className="button"><Plus size={17} /> Log session</button>
        </form>
      </Panel>
      <Panel title="Recent sessions" icon={<Activity size={18} />}>
        <List items={data.workoutLogs.slice().reverse().map((log) => `${log.type} · ${log.durationMinutes} min · ${log.intensity} · ${log.exercises.map((ex) => ex.name).join(", ")}`)} />
      </Panel>
    </section>
  );
}

function SymptomsPage({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const [form, setForm] = useState({ name: "Shin splint", type: "Tightness" as SymptomType, severity: 4, bodyLocation: "Shin", notes: "" });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setData((current) => ({ ...current, symptomLogs: [...current.symptomLogs, { ...form, id: uid("symptom"), loggedAt: new Date().toISOString() }] }));
  };
  return (
    <section className="grid two">
      <Panel title="Symptom log" icon={<HeartPulse size={18} />}>
        <div className="quick-strip compact"><button onClick={() => setForm({ ...form, name: "Shin splint", bodyLocation: "Shin", type: "Tightness" })}>Shin splint</button><button onClick={() => setForm({ ...form, name: "Calf soreness", bodyLocation: "Shank / Calf", type: "Soreness" })}>Shank / calf</button></div>
        <form className="form" onSubmit={submit}>
          <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <div className="row"><label>Type<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as SymptomType })}>{symptomTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label>Location<select value={form.bodyLocation} onChange={(event) => setForm({ ...form, bodyLocation: event.target.value })}>{locations.map((item) => <option key={item}>{item}</option>)}</select></label></div>
          <label>Severity {form.severity}/10<input type="range" min="1" max="10" value={form.severity} onChange={(event) => setForm({ ...form, severity: Number(event.target.value) })} /></label>
          <label>Notes<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
          <button className="button"><Plus size={17} /> Log symptom</button>
        </form>
      </Panel>
      <Panel title="Symptom history" icon={<BarChart3 size={18} />}>
        <List items={data.symptomLogs.slice().reverse().map((log) => `${log.bodyLocation}: ${log.name} · ${log.type} · ${log.severity}/10`)} />
      </Panel>
    </section>
  );
}

function CheckInPage({ data, setData, todayWaterMl }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; todayWaterMl: number }) {
  const existing = data.mentalLogs.find((log) => log.date === todayKey());
  const [form, setForm] = useState(existing ?? { date: todayKey(), mood: 7, energy: 6, sleepHours: 7.5, waterGlasses: Math.round(todayWaterMl / 250), journal: "" });
  const [steps, setSteps] = useState(data.stepLogs.find((log) => log.date === todayKey())?.stepCount ?? 0);
  const save = (event: FormEvent) => {
    event.preventDefault();
    setData((current) => ({
      ...current,
      mentalLogs: [...current.mentalLogs.filter((log) => log.date !== todayKey()), form],
      stepLogs: [...current.stepLogs.filter((log) => log.date !== todayKey()), { date: todayKey(), stepCount: steps }],
    }));
  };
  return (
    <section className="grid two">
      <Panel title="Daily check-in" icon={<Brain size={18} />}>
        <form className="form" onSubmit={save}>
          <label>Mood {moodEmoji(form.mood)} {form.mood}/10<input type="range" min="1" max="10" value={form.mood} onChange={(event) => setForm({ ...form, mood: Number(event.target.value) })} /></label>
          <label>Energy {form.energy}/10<input type="range" min="1" max="10" value={form.energy} onChange={(event) => setForm({ ...form, energy: Number(event.target.value) })} /></label>
          <div className="row"><label>Sleep hours<input type="number" step="0.1" value={form.sleepHours} onChange={(event) => setForm({ ...form, sleepHours: Number(event.target.value) })} /></label><label>Steps<input type="number" value={steps} onChange={(event) => setSteps(Number(event.target.value))} /></label></div>
          <label>Journal<textarea value={form.journal} onChange={(event) => setForm({ ...form, journal: event.target.value })} /></label>
          <button className="button">Save check-in</button>
        </form>
      </Panel>
      <Panel title="Weekly history" icon={<Sparkles size={18} />}>
        <List items={data.mentalLogs.slice().reverse().map((log) => `${log.date} · ${moodEmoji(log.mood)} mood ${log.mood}/10 · ${log.sleepHours}h sleep · energy ${log.energy}/10`)} />
      </Panel>
    </section>
  );
}

function ProfilePage({ data, setData, setProfile }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; setProfile: (patch: Partial<AppData["profile"]>) => void }) {
  const p = data.profile;
  const bmr = Math.round(10 * p.weight + 6.25 * p.height - 5 * 30 - 161);
  const tdee = Math.round(bmr * 1.45);
  return (
    <section className="grid two">
      <Panel title="Body metrics & goals" icon={<Settings size={18} />}>
        <div className="form">
          <label>Name<input value={p.name} onChange={(event) => setProfile({ name: event.target.value })} /></label>
          <div className="row"><label>Weight kg<input type="number" value={p.weight} onChange={(event) => setProfile({ weight: Number(event.target.value) })} /></label><label>Height cm<input type="number" value={p.height} onChange={(event) => setProfile({ height: Number(event.target.value) })} /></label></div>
          <div className="row"><label>Fat mass<input type="number" value={p.fatMass} onChange={(event) => setProfile({ fatMass: Number(event.target.value) })} /></label><label>Lean mass<input type="number" value={p.leanMass} onChange={(event) => setProfile({ leanMass: Number(event.target.value) })} /></label></div>
          <div className="row"><label>Calories<input type="number" value={p.calorieGoal} onChange={(event) => setProfile({ calorieGoal: Number(event.target.value) })} /></label><label>Steps<input type="number" value={p.stepGoal} onChange={(event) => setProfile({ stepGoal: Number(event.target.value) })} /></label><label>Water glasses<input type="number" value={p.waterGoal} onChange={(event) => setProfile({ waterGoal: Number(event.target.value) })} /></label></div>
          <label>Health goal<select value={p.goal} onChange={(event) => setProfile({ goal: event.target.value as HealthGoal })}>{goals.map((goal) => <option key={goal}>{goal}</option>)}</select></label>
        </div>
        <div className="reference"><span>BMR {bmr} kcal</span><span>TDEE {tdee} kcal</span></div>
      </Panel>
      <Panel title="Food library management" icon={<Apple size={18} />}>
        <div className="library editable">
          {data.foodLibrary.map((item) => (
            <span key={item.id}>{item.name}<small>{item.calories} kcal · logged {item.timesLogged}x</small><button onClick={() => setData((current) => ({ ...current, foodLibrary: current.foodLibrary.filter((food) => food.id !== item.id) }))}><Trash2 size={15} /></button></span>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Metric({ icon, label, value, detail, progress }: { icon: React.ReactNode; label: string; value: string; detail: string; progress: number }) {
  return <article className="metric">{icon}<p>{label}</p><strong>{value}</strong><span>{detail}</span><Progress value={progress} /></article>;
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <article className="panel"><h2>{icon}{title}</h2>{children}</article>;
}

function Progress({ value }: { value: number }) {
  return <div className="progress"><span style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }} /></div>;
}

function List({ items }: { items: string[] }) {
  return <div className="list">{items.length ? items.map((item, index) => <p key={`${item}-${index}`}>{item}</p>) : <p>No entries yet.</p>}</div>;
}

function moodEmoji(value: number) {
  return value >= 9 ? "😁" : value >= 7 ? "🙂" : value >= 5 ? "😐" : value >= 3 ? "😟" : "😢";
}

function mealForNow(): MealTag {
  const hour = new Date().getHours();
  if (hour < 11) return "Breakfast";
  if (hour < 16) return "Lunch";
  if (hour < 21) return "Dinner";
  return "Snacks";
}

function navIcon(item: string) {
  const icons: Record<string, React.ReactNode> = {
    Today: <Sparkles size={18} />,
    Dashboard: <BarChart3 size={18} />,
    Food: <Apple size={18} />,
    Gym: <Dumbbell size={18} />,
    Symptoms: <HeartPulse size={18} />,
    "Check-in": <Brain size={18} />,
    Profile: <Settings size={18} />,
  };
  return icons[item];
}

createRoot(document.getElementById("root")!).render(<App />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  });
}
