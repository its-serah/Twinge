import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Apple,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
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
import { AppData, FoodItem, FoodLog, HealthGoal, Intensity, MealFeeling, MealTag, SymptomType } from "./lib/types";
import "./styles/app.css";

const meals: MealTag[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];
const mealFeelings: MealFeeling[] = ["Neutral", "Felt good", "Energized", "Bloated", "Crashed", "Heavy"];
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
const fontOptions = [
  { name: "Rounded Friendly", font: '"Trebuchet MS", "Avenir Next", Avenir, sans-serif', weight: "900" },
  { name: "Soft Editorial", font: 'Georgia, "Times New Roman", serif', weight: "700" },
  { name: "Clean Humanist", font: '"Avenir Next", Avenir, "Segoe UI", sans-serif', weight: "800" },
  { name: "Playful System", font: '"Arial Rounded MT Bold", "Trebuchet MS", sans-serif', weight: "800" },
  { name: "Calm Classic", font: 'Palatino, "Palatino Linotype", Georgia, serif', weight: "700" },
  { name: "Modern Simple", font: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', weight: "800" },
  { name: "Warm Serif", font: 'Cambria, Georgia, serif', weight: "700" },
  { name: "Bubble Soft", font: '"Comic Sans MS", "Trebuchet MS", cursive', weight: "800" },
  { name: "App Rounded", font: 'Verdana, Geneva, sans-serif', weight: "800" },
  { name: "Friendly Narrow", font: '"Gill Sans", "Gill Sans MT", Calibri, sans-serif', weight: "800" },
  { name: "Health Journal", font: '"Optima", "Segoe UI", sans-serif', weight: "700" },
  { name: "Bold Calm", font: 'Tahoma, Geneva, sans-serif', weight: "800" },
  { name: "Soft Typewriter", font: '"Courier New", Courier, monospace', weight: "700" },
  { name: "Rounded Display", font: '"Century Gothic", "Trebuchet MS", sans-serif', weight: "800" },
  { name: "Elegant Serif", font: 'Baskerville, "Baskerville Old Face", Georgia, serif', weight: "700" },
  { name: "Simple Cozy", font: 'Candara, Calibri, "Segoe UI", sans-serif', weight: "800" },
  { name: "Chunky Friendly", font: 'Impact, "Arial Black", sans-serif', weight: "400" },
  { name: "Soft UI", font: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', weight: "800" },
  { name: "Bookish Calm", font: 'Garamond, Georgia, serif', weight: "700" },
  { name: "Logo Match", font: '"Trebuchet MS", Verdana, sans-serif', weight: "900" },
  { name: "Cozy Marker", font: '"Marker Felt", "Comic Sans MS", cursive', weight: "800" },
  { name: "Bright Humanist", font: '"Lucida Grande", "Lucida Sans Unicode", Verdana, sans-serif', weight: "800" },
  { name: "Soft Newspaper", font: 'Constantia, Georgia, serif', weight: "700" },
  { name: "Tiny Rounded", font: '"Arial Rounded MT Bold", Verdana, sans-serif', weight: "700" },
  { name: "Friendly Book", font: '"Bookman Old Style", Georgia, serif', weight: "700" },
  { name: "Fresh App", font: 'Calibri, Candara, "Segoe UI", sans-serif', weight: "800" },
  { name: "Casual Bold", font: '"Comic Sans MS", "Arial Rounded MT Bold", cursive', weight: "900" },
  { name: "Soft Luxury", font: 'Didot, "Bodoni 72", Georgia, serif', weight: "700" },
  { name: "Clear Rounded", font: '"Lucida Sans", "Lucida Grande", Verdana, sans-serif', weight: "800" },
  { name: "Cute Compact", font: '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif', weight: "800" },
  { name: "Gentle Serif", font: '"Iowan Old Style", Palatino, Georgia, serif', weight: "700" },
  { name: "Warm Sans", font: 'Corbel, Candara, "Segoe UI", sans-serif', weight: "800" },
  { name: "Rounded Heavy", font: '"Arial Black", "Trebuchet MS", sans-serif', weight: "900" },
  { name: "Soft Slab", font: 'Rockwell, "Courier New", serif', weight: "700" },
  { name: "Simple Friendly", font: '"Helvetica Neue", Helvetica, Arial, sans-serif', weight: "800" },
  { name: "Playful Print", font: '"Bradley Hand", "Comic Sans MS", cursive', weight: "800" },
  { name: "Warm Classic", font: '"Hoefler Text", Baskerville, Georgia, serif', weight: "700" },
  { name: "Balanced UI", font: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif', weight: "800" },
  { name: "Cute Strong", font: '"Cooper Black", "Arial Black", "Trebuchet MS", sans-serif', weight: "800" },
  { name: "Soft Notes", font: '"Noteworthy", "Comic Sans MS", cursive', weight: "800" },
  { name: "Soft Script", font: '"Segoe Print", "Comic Sans MS", cursive', weight: "800" },
  { name: "Rounded News", font: 'Charter, Georgia, serif', weight: "700" },
  { name: "Clean Tablet", font: '"Noto Sans", "Segoe UI", system-ui, sans-serif', weight: "800" },
  { name: "Friendly Screen", font: '"Ubuntu", "Trebuchet MS", sans-serif', weight: "800" },
  { name: "Cute Journal", font: '"Chalkboard SE", "Comic Sans MS", cursive', weight: "800" },
  { name: "Modern Rounded", font: '"Nunito", "Trebuchet MS", sans-serif', weight: "900" },
  { name: "Soft Geometric", font: '"Futura", "Century Gothic", sans-serif', weight: "800" },
  { name: "Warm Grotesk", font: '"Proxima Nova", "Avenir Next", sans-serif', weight: "800" },
  { name: "Health Soft", font: '"Source Sans Pro", "Segoe UI", sans-serif', weight: "800" },
  { name: "Cozy Sans", font: '"Lato", "Avenir Next", sans-serif', weight: "800" },
  { name: "Playful Round", font: '"Quicksand", "Trebuchet MS", sans-serif', weight: "900" },
  { name: "Fresh Rounded", font: '"Montserrat", "Century Gothic", sans-serif', weight: "800" },
  { name: "Gentle UI", font: '"Open Sans", "Segoe UI", sans-serif', weight: "800" },
  { name: "Soft Display", font: '"Poppins", "Trebuchet MS", sans-serif', weight: "900" },
  { name: "Friendly Tall", font: '"Barlow", "Arial Narrow", sans-serif', weight: "800" },
  { name: "Rounded Cozy", font: '"Varela Round", "Trebuchet MS", sans-serif', weight: "800" },
  { name: "Cute Medical", font: '"M PLUS Rounded 1c", "Trebuchet MS", sans-serif', weight: "900" },
  { name: "Calm Rounded", font: '"Comfortaa", "Trebuchet MS", sans-serif', weight: "900" },
  { name: "Soft Organic", font: '"Josefin Sans", "Gill Sans", sans-serif', weight: "800" },
  { name: "Warm Hand", font: '"Comic Neue", "Comic Sans MS", cursive', weight: "800" },
  { name: "Peach Pop", font: '"Baloo 2", "Cooper Black", "Trebuchet MS", sans-serif', weight: "900" },
  { name: "Cute Bounce", font: '"Fredoka", "Arial Rounded MT Bold", sans-serif', weight: "900" },
  { name: "Soft Bubble", font: '"Chewy", "Cooper Black", cursive', weight: "800" },
  { name: "Dreamy Serif", font: '"Fraunces", Georgia, serif', weight: "800" },
  { name: "Tiny Charm", font: '"Space Grotesk", "Trebuchet MS", sans-serif', weight: "800" },
  { name: "Cool Rounded", font: '"Sora", "Avenir Next", sans-serif', weight: "800" },
  { name: "Happy Notes", font: '"Gaegu", "Comic Sans MS", cursive', weight: "800" },
  { name: "Soft Clinic", font: '"DM Sans", "Avenir Next", sans-serif', weight: "900" },
  { name: "Cute Retro", font: '"Recoleta", "Cooper Black", Georgia, serif', weight: "800" },
  { name: "Rounded Baby", font: '"Sniglet", "Arial Rounded MT Bold", cursive', weight: "800" },
  { name: "Cloud Sans", font: '"Manrope", "Segoe UI", sans-serif', weight: "800" },
  { name: "Warm Display", font: '"Bricolage Grotesque", "Trebuchet MS", sans-serif', weight: "900" },
  { name: "Mint Journal", font: '"Kalam", "Comic Sans MS", cursive', weight: "800" },
  { name: "Orange Punch", font: '"Titan One", "Cooper Black", sans-serif', weight: "800" },
  { name: "Soft Rounded Pro", font: '"Rubik", "Trebuchet MS", sans-serif', weight: "900" },
  { name: "Sweet Serif", font: '"Cormorant Garamond", Garamond, serif', weight: "800" },
  { name: "Cool Health", font: '"Urbanist", "Avenir Next", sans-serif', weight: "900" },
  { name: "Play Date", font: '"Patrick Hand", "Comic Sans MS", cursive', weight: "800" },
  { name: "Rounded Fresh", font: '"Plus Jakarta Sans", "Segoe UI", sans-serif', weight: "900" },
  { name: "Soft Stamp", font: '"Bree Serif", Rockwell, serif', weight: "800" },
  { name: "Little Blob", font: '"Lilita One", "Cooper Black", sans-serif', weight: "800" },
  { name: "Cute Caps", font: '"League Spartan", "Arial Black", sans-serif', weight: "900", transform: "uppercase", spacing: "0.02em" },
  { name: "Calm Chic", font: '"Playfair Display", Georgia, serif', weight: "800" },
  { name: "Friendly Mono", font: '"Space Mono", "Courier New", monospace', weight: "700" },
  { name: "Round Hug", font: '"Nunito Sans", "Trebuchet MS", sans-serif', weight: "900" },
  { name: "Soft Groovy", font: '"Righteous", "Arial Rounded MT Bold", sans-serif', weight: "800" },
  { name: "Pocket Diary", font: '"Handlee", "Comic Sans MS", cursive', weight: "800" },
  { name: "Smooth App", font: '"Inter Tight", "Arial Narrow", sans-serif', weight: "900" },
  { name: "Cute Calm", font: '"Mulish", "Avenir Next", sans-serif', weight: "900" },
  { name: "Warm Human", font: '"Epilogue", "Avenir Next", sans-serif', weight: "900" },
  { name: "Soft Curl", font: '"Yeseva One", Georgia, serif', weight: "800" },
  { name: "Tiny Joy", font: '"Short Stack", "Comic Sans MS", cursive', weight: "800" },
  { name: "Rounded Tech", font: '"Outfit", "Segoe UI", sans-serif', weight: "900" },
  { name: "Sweet Bold", font: '"Paytone One", "Cooper Black", sans-serif', weight: "800" },
  { name: "Care Label", font: '"Work Sans", "Avenir Next", sans-serif', weight: "900" },
  { name: "Soft Italic", font: '"Libre Baskerville", Georgia, serif', weight: "700", style: "italic" },
  { name: "Cool Cute", font: '"Archivo Rounded", "Arial Rounded MT Bold", sans-serif', weight: "900" },
  { name: "Handmade", font: '"Coming Soon", "Comic Sans MS", cursive', weight: "800" },
  { name: "Rounded Logo", font: '"DynaPuff", "Cooper Black", cursive', weight: "800" },
  { name: "Fresh Cute", font: '"Lexend", "Trebuchet MS", sans-serif', weight: "900" },
];

function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [active, setActive] = useState("Today");
  const [stage, setStage] = useState<"landing" | "app">("landing");

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

  const addWater = (amountMl: number) => {
    setData((current) => ({ ...current, waterLogs: [...current.waterLogs, { id: uid("water"), amountMl, loggedAt: new Date().toISOString() }] }));
  };

  if (new URLSearchParams(window.location.search).has("fonts") || window.location.hash === "#fonts") {
    return <FontStylesPage />;
  }

  if (stage === "landing") {
    return <LandingPage onEnter={() => setStage("app")} />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><img src="/LOGOTWINGE-transparent.png" alt="Twinge logo" /></div>
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
            addWater={addWater}
          />
        )}
        {active === "Food" && <FoodPage data={data} setData={setData} totals={totals} />}
        {active === "Gym" && <GymPage data={data} setData={setData} />}
        {active === "Symptoms" && <SymptomsPage data={data} setData={setData} />}
        {active === "Check-in" && <CheckInPage data={data} setData={setData} todayWaterMl={todayWaterMl} />}
        {active === "Profile" && <ProfilePage data={data} setData={setData} setProfile={setProfile} />}
      </main>
      <QuickLogDock setActive={setActive} addWater={addWater} />
    </div>
  );
}


function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [launching, setLaunching] = useState(false);

  const startTracking = () => {
    if (launching) return;
    setLaunching(true);
    window.setTimeout(onEnter, 1540);
  };

  return (
    <main className="landing">
      <section className="landing-card">
        <div className="landing-mark"><img src="/LOGOTWINGE-transparent.png" alt="Twinge logo" /></div>
        <p className="eyebrow">feel it. track it. understand it.</p>
        <h1>Tune into what your body is saying.</h1>
        <p className="landing-copy">Log meals, movement, mood, and symptoms so your daily patterns start making sense.</p>
        <div className="landing-actions">
          <button className={launching ? "button landing-button launching" : "button landing-button"} onClick={startTracking} disabled={launching}>
            <span className="landing-arrow-chip"><img src="/slider-icon.png" alt="" /></span>
            <span className="landing-button-label">Start tracking</span>
          </button>
        </div>
      </section>
    </main>
  );
}

function FontStylesPage() {
  return (
    <main className="font-page">
      <header className="font-page-header">
        <img src="/LOGOTWINGE-transparent.png" alt="Twinge logo" />
        <div>
          <p className="eyebrow">Choose a landing font</p>
          <h1>100 font styles for Twinge</h1>
          <p>Pick the number that feels cutest with the logo.</p>
        </div>
        <a className="button ghost" href="/">Back</a>
      </header>
      <section className="font-grid">
        {fontOptions.map((option, index) => (
          <article
            className="font-card"
            key={option.name}
            style={{
              ["--preview-font" as string]: option.font,
              ["--preview-weight" as string]: option.weight,
              ["--preview-spacing" as string]: "spacing" in option ? option.spacing : "0",
              ["--preview-transform" as string]: "transform" in option ? option.transform : "none",
              ["--preview-style" as string]: "style" in option ? option.style : "normal",
            }}
          >
            <span className="font-number">{String(index + 1).padStart(2, "0")}</span>
            <img src="/LOGOTWINGE-transparent.png" alt="" />
            <small>{option.name}</small>
            <h2>Understand your body patterns.</h2>
            <p>Track food, water, workouts, symptoms, and mood in one calm daily loop.</p>
          </article>
        ))}
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

function TodayPage({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; setActive: (tab: string) => void }) {
  const meal = mealForNow();
  const todayFoodLogs = data.foodLogs.filter((log) => log.loggedAt.startsWith(todayKey())).slice().reverse();
  const [query, setQuery] = useState("");
  const [manual, setManual] = useState({ calories: 0, protein: 0, fiber: 0 });
  const [feeling, setFeeling] = useState<MealFeeling>("Neutral");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const matches = [...data.foodLibrary, ...commonFoods].filter((food) => food.name.toLowerCase().includes(query.toLowerCase()) && query.trim());
  const suggestedFoods = mealSuggestions(data, meal);

  const clearForm = () => {
    setQuery("");
    setManual({ calories: 0, protein: 0, fiber: 0 });
    setEditingId(null);
  };

  const logFood = (food: FoodItem) => {
    if (editingId) {
      setData((current) => ({
        ...current,
        foodLogs: current.foodLogs.map((log) => log.id === editingId ? { ...log, name: food.name, calories: food.calories, protein: food.protein, fiber: food.fiber, mealTag: meal, feeling } : log),
      }));
      setConfirmation(`Updated ${food.name}.`);
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
        foodLogs: [...current.foodLogs, { ...food, id: uid("log"), mealTag: meal, feeling, loggedAt: new Date().toISOString() }],
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
    setQuery(log.name);
    setManual({ calories: log.calories, protein: log.protein, fiber: log.fiber });
    setFeeling(log.feeling ?? "Neutral");
    setConfirmation(`Editing ${log.name}.`);
  };

  const deleteFoodLog = (id: string) => {
    setData((current) => ({ ...current, foodLogs: current.foodLogs.filter((log) => log.id !== id) }));
    setConfirmation("Removed that food from today.");
    if (editingId === id) clearForm();
  };

  return (
    <section className="today-flow simple-food-flow">
      <article className="food-now-card">
        <div>
          <p className="eyebrow">{new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</p>
          <h2>Looks like {meal.toLowerCase()}.</h2>
          <p>Select what you usually eat around now. If it is not here, add it manually.</p>
        </div>
        <div className="meal-suggestion compact">
          <Clock size={18} />
          <span>Auto-selected</span>
          <strong>{meal}</strong>
        </div>
      </article>

      {confirmation && <div className="added-toast"><CheckCircle2 size={18} /> {confirmation}</div>}

      <Panel title={`Suggested for ${meal}`} icon={<Sparkles size={18} />}>
        <div className="suggested-food-grid">
          {suggestedFoods.length ? suggestedFoods.map((food) => (
            <button key={food.id} onClick={() => logFood(food)}>
              <strong>{food.name}</strong>
              <small>{food.calories} kcal · {food.protein}g protein</small>
            </button>
          )) : <p className="empty-note">No usual foods for this time yet. Add one below and Twinge will remember it.</p>}
        </div>
      </Panel>

      <details className="manual-food" open={suggestedFoods.length === 0 || Boolean(editingId)}>
        <summary>{editingId ? "Edit food" : "Add something else"}</summary>
        <form className="form" onSubmit={submitManual}>
          <label>Food name<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type what you ate" /></label>
          <label>How did it feel?<select value={feeling} onChange={(event) => setFeeling(event.target.value as MealFeeling)}>{mealFeelings.map((item) => <option key={item}>{item}</option>)}</select></label>
          {matches.length > 0 && <div className="match-box">{matches.slice(0, 5).map((food) => <button type="button" key={food.id} onClick={() => logFood(food)}>Use {food.name} · {food.calories} kcal</button>)}</div>}
          <div className="row">
            <label>Calories<input type="number" value={manual.calories} onChange={(event) => setManual({ ...manual, calories: Number(event.target.value) })} /></label>
            <label>Protein<input type="number" value={manual.protein} onChange={(event) => setManual({ ...manual, protein: Number(event.target.value) })} /></label>
            <label>Fiber<input type="number" value={manual.fiber} onChange={(event) => setManual({ ...manual, fiber: Number(event.target.value) })} /></label>
          </div>
          <div className="form-actions">
            <button className="button"><Plus size={17} /> {editingId ? "Save" : `Add to ${meal}`}</button>
            {editingId && <button type="button" className="button ghost" onClick={clearForm}>Cancel</button>}
          </div>
        </form>
      </details>

      <Panel title="Logged today" icon={<Apple size={18} />}>
        <div className="today-food-list">
          {todayFoodLogs.length ? todayFoodLogs.map((log) => (
            <article key={log.id} className="logged-food">
              <div>
                <strong>{log.name}</strong>
                <small>{log.mealTag} · {log.calories} kcal · {log.protein}g protein · {log.fiber}g fiber{log.feeling ? ` · ${log.feeling}` : ""}</small>
              </div>
              <div className="food-actions">
                <button aria-label={`Edit ${log.name}`} onClick={() => editFoodLog(log)}><Pencil size={16} /></button>
                <button aria-label={`Delete ${log.name}`} onClick={() => deleteFoodLog(log.id)}><Trash2 size={16} /></button>
              </div>
            </article>
          )) : <p className="empty-note">Nothing logged yet today.</p>}
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
  const twingeScore = getTwingeScore(data, totals, todayWaterMl, todaySteps, todayMental);
  const recoveryMode = symptoms.some((symptom) => symptom.severity >= 7) || (todayMental?.energy ?? 10) <= 3 || (todayMental?.sleepHours ?? 8) < 5.5;
  const insights = getPatternInsights(data);
  const timeline = getDailyTimeline(data);
  const weeklyStory = getWeeklyStory(data);
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
          <h2>{recoveryMode ? "Recovery mode" : `${twingeScore}% twinge score`}</h2>
          <p>{recoveryMode ? "Today looks like a lower-capacity day. Keep the loop focused on hydration, sleep, and gentle notes." : "Start with a check-in, log what matters, then watch your daily rhythm come together."}</p>
          <div className="hero-tags">
            <span>{totals.protein}g protein</span>
            <span>{totals.fiber}g fiber</span>
            <span>{symptoms.length} symptoms</span>
          </div>
        </div>
        <div className="readiness-dial" style={{ ["--score" as string]: `${recoveryMode ? Math.max(20, readiness - 15) : twingeScore}%` }}>
          <strong>{moodEmoji(todayMental?.mood ?? 5)}</strong>
          <span>{todayMental?.sleepHours ?? 0}h sleep</span>
        </div>
      </div>

      {recoveryMode && (
        <Panel title="Recovery focus" icon={<HeartPulse size={18} />}>
          <div className="recovery-grid">
            <span>Hydrate steadily</span>
            <span>Keep movement light</span>
            <span>Follow up on pain tomorrow</span>
            <span>Prioritize sleep tonight</span>
          </div>
        </Panel>
      )}

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

      <div className="grid two">
        <Panel title="Pattern detective" icon={<Sparkles size={18} />}>
          <div className="insight-grid">
            {insights.map((insight) => (
              <article key={insight.title} className="insight-card">
                <strong>{insight.title}</strong>
                <p>{insight.copy}</p>
              </article>
            ))}
          </div>
        </Panel>
        <Panel title="Weekly body story" icon={<CalendarDays size={18} />}>
          <div className="story-card">
            <strong>{weeklyStory.title}</strong>
            <p>{weeklyStory.copy}</p>
          </div>
        </Panel>
      </div>

      <Panel title="Cause-and-effect timeline" icon={<Clock size={18} />}>
        <div className="timeline">
          {timeline.length ? timeline.map((item) => (
            <article key={`${item.time}-${item.detail}`} className={`timeline-item ${item.kind}`}>
              <span>{item.time}</span>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </article>
          )) : <p className="empty-note">No timeline entries yet today.</p>}
        </div>
      </Panel>

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
              <Bar dataKey="steps" fill="#ff4610" radius={[6, 6, 0, 0]} />
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
              <Line dataKey="mood" stroke="#ff4610" strokeWidth={3} />
              <Line dataKey="energy" stroke="#246b63" strokeWidth={3} />
              <Line dataKey="sleep" stroke="#d4eae8" strokeWidth={3} />
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
  const [feeling, setFeeling] = useState<MealFeeling>("Neutral");
  const [manual, setManual] = useState({ calories: 0, protein: 0, fiber: 0 });
  const matches = [...data.foodLibrary, ...commonFoods].filter((food) => food.name.toLowerCase().includes(query.toLowerCase()) && query.trim());

  const logFood = (food: FoodItem) => {
    setData((current) => {
      const library = current.foodLibrary.some((item) => item.name.toLowerCase() === food.name.toLowerCase())
        ? current.foodLibrary.map((item) => item.name.toLowerCase() === food.name.toLowerCase() ? { ...item, timesLogged: item.timesLogged + 1 } : item)
        : [...current.foodLibrary, { ...food, id: uid("food"), timesLogged: 1 }];
      return { ...current, foodLibrary: library, foodLogs: [...current.foodLogs, { ...food, id: uid("log"), mealTag: meal, feeling, loggedAt: new Date().toISOString() }] };
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
          <label>After-meal feel<select value={feeling} onChange={(event) => setFeeling(event.target.value as MealFeeling)}>{mealFeelings.map((item) => <option key={item}>{item}</option>)}</select></label>
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
        <List items={data.foodLogs.filter((log) => log.loggedAt.startsWith(todayKey())).map((log) => `${log.mealTag}: ${log.name} · ${log.calories} kcal${log.feeling ? ` · ${log.feeling}` : ""}`)} />
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
        <BodyMap selected={form.bodyLocation} logs={data.symptomLogs} onSelect={(location) => setForm({ ...form, bodyLocation: location, name: location === "Head" ? "Headache" : `${location} pain` })} />
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
        <div className="heat-list">
          {symptomHeat(data.symptomLogs).map((item) => <span key={item.location}>{item.location}<strong>{item.count}</strong></span>)}
        </div>
        <List items={data.symptomLogs.slice().reverse().map((log) => `${log.bodyLocation}: ${log.name} · ${log.type} · ${log.severity}/10`)} />
      </Panel>
    </section>
  );
}

function CheckInPage({ data, setData, todayWaterMl }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; todayWaterMl: number }) {
  const existing = data.mentalLogs.find((log) => log.date === todayKey());
  const [form, setForm] = useState(existing ?? { date: todayKey(), mood: 7, energy: 6, sleepHours: 7.5, waterGlasses: Math.round(todayWaterMl / 250), journal: "" });
  const [steps, setSteps] = useState(data.stepLogs.find((log) => log.date === todayKey())?.stepCount ?? 0);
  const prompts = getCheckInPrompts(data);
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
        <div className="prompt-stack">
          {prompts.map((prompt) => <span key={prompt}>{prompt}</span>)}
        </div>
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

function QuickLogDock({ setActive, addWater }: { setActive: (tab: string) => void; addWater: (amountMl: number) => void }) {
  return (
    <nav className="quick-dock" aria-label="Quick log">
      <button onClick={() => setActive("Food")} aria-label="Log food"><Apple size={19} /><span>Food</span></button>
      <button onClick={() => addWater(250)} aria-label="Add water"><Droplets size={19} /><span>Water</span></button>
      <button onClick={() => setActive("Symptoms")} aria-label="Log symptom"><HeartPulse size={19} /><span>Pain</span></button>
      <button onClick={() => setActive("Check-in")} aria-label="Open check-in"><Brain size={19} /><span>Mood</span></button>
      <button onClick={() => setActive("Gym")} aria-label="Log workout"><Dumbbell size={19} /><span>Gym</span></button>
    </nav>
  );
}

function BodyMap({ selected, logs, onSelect }: { selected: string; logs: AppData["symptomLogs"]; onSelect: (location: string) => void }) {
  const heat = new Map(symptomHeat(logs).map((item) => [item.location, item.count]));
  const points = [
    { location: "Head", x: 50, y: 12 },
    { location: "Back", x: 50, y: 34 },
    { location: "Stomach", x: 50, y: 43 },
    { location: "Hip", x: 50, y: 54 },
    { location: "Thigh", x: 38, y: 66 },
    { location: "Knee", x: 62, y: 74 },
    { location: "Shin", x: 42, y: 84 },
    { location: "Shank / Calf", x: 60, y: 84 },
    { location: "Ankle", x: 50, y: 94 },
  ];

  return (
    <div className="body-map">
      <div className="body-silhouette" aria-hidden="true">
        <span className="head" />
        <span className="torso" />
        <span className="arm left" />
        <span className="arm right" />
        <span className="leg left" />
        <span className="leg right" />
      </div>
      {points.map((point) => {
        const count = heat.get(point.location) ?? 0;
        return (
          <button
            key={point.location}
            className={selected === point.location ? "body-point active" : "body-point"}
            style={{ left: `${point.x}%`, top: `${point.y}%`, ["--heat" as string]: `${Math.min(1, count / 5)}` }}
            onClick={() => onSelect(point.location)}
            type="button"
            title={`${point.location}${count ? `, ${count} logs` : ""}`}
          >
            <span>{count || ""}</span>
          </button>
        );
      })}
    </div>
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

function getTwingeScore(data: AppData, totals: { calories: number }, todayWaterMl: number, todaySteps: number, todayMental?: { mood: number; energy: number; sleepHours: number }) {
  const symptoms = data.symptomLogs.filter((log) => log.loggedAt.startsWith(todayKey()));
  const calorieScore = clampScore(100 - Math.abs(totals.calories - data.profile.calorieGoal) / data.profile.calorieGoal * 100);
  const waterScore = clampScore((todayWaterMl / 250 / data.profile.waterGoal) * 100);
  const stepScore = clampScore((todaySteps / data.profile.stepGoal) * 100);
  const moodScore = ((todayMental?.mood ?? 5) / 10) * 100;
  const energyScore = ((todayMental?.energy ?? 5) / 10) * 100;
  const sleepScore = clampScore(((todayMental?.sleepHours ?? 7) / 8) * 100);
  const symptomPenalty = Math.min(30, symptoms.reduce((sum, symptom) => sum + symptom.severity, 0) * 2);
  return Math.round(clampScore((calorieScore + waterScore + stepScore + moodScore + energyScore + sleepScore) / 6 - symptomPenalty));
}

function getDailyTimeline(data: AppData) {
  const today = todayKey();
  const items = [
    ...data.foodLogs.filter((log) => log.loggedAt.startsWith(today)).map((log) => ({ time: timeLabel(log.loggedAt), label: `${log.mealTag}: ${log.name}`, detail: `${log.calories} kcal${log.feeling ? ` · ${log.feeling}` : ""}`, kind: "food" })),
    ...data.waterLogs.filter((log) => log.loggedAt.startsWith(today)).map((log) => ({ time: timeLabel(log.loggedAt), label: "Water", detail: `${log.amountMl} ml`, kind: "water" })),
    ...data.workoutLogs.filter((log) => log.loggedAt.startsWith(today)).map((log) => ({ time: timeLabel(log.loggedAt), label: log.type, detail: `${log.durationMinutes} min · ${log.intensity}`, kind: "gym" })),
    ...data.symptomLogs.filter((log) => log.loggedAt.startsWith(today)).map((log) => ({ time: timeLabel(log.loggedAt), label: log.bodyLocation, detail: `${log.type} · ${log.severity}/10`, kind: "symptom" })),
  ];
  return items.sort((a, b) => a.time.localeCompare(b.time));
}

function getPatternInsights(data: AppData) {
  const highIntensityDates = new Set(data.workoutLogs.filter((log) => log.intensity === "High" || /leg|run|cardio/i.test(log.type)).map((log) => log.loggedAt.slice(0, 10)));
  const painAfterTraining = data.symptomLogs.filter((log) => highIntensityDates.has(log.loggedAt.slice(0, 10)) && /shin|shank|calf|knee|ankle/i.test(log.bodyLocation)).length;
  const lowSleepDays = data.mentalLogs.filter((log) => log.sleepHours < 6.5);
  const lowSleepSnackCalories = average(lowSleepDays.map((day) => data.foodLogs.filter((log) => log.loggedAt.startsWith(day.date) && log.mealTag === "Snacks").reduce((sum, log) => sum + log.calories, 0)));
  const taggedMeals = data.foodLogs.filter((log) => log.feeling && log.feeling !== "Neutral");
  const bestFeeling = mostCommon(taggedMeals.filter((log) => log.feeling === "Felt good" || log.feeling === "Energized").map((log) => log.name));
  const headacheWaterDays = data.symptomLogs.filter((log) => /head/i.test(log.bodyLocation) || /headache/i.test(log.name)).map((log) => log.loggedAt.slice(0, 10));
  const lowWaterHeadaches = headacheWaterDays.filter((date) => data.waterLogs.filter((log) => log.loggedAt.startsWith(date)).reduce((sum, log) => sum + log.amountMl, 0) < data.profile.waterGoal * 250).length;

  return [
    {
      title: "Pain after movement",
      copy: painAfterTraining ? `${painAfterTraining} lower-body symptom logs landed on harder training days.` : "No strong lower-body pain pattern after training yet.",
    },
    {
      title: "Sleep and snacking",
      copy: lowSleepDays.length ? `On lower-sleep days, snacks average ${Math.round(lowSleepSnackCalories)} kcal.` : "Log a few more low-sleep days to compare snack patterns.",
    },
    {
      title: "Food mood memory",
      copy: bestFeeling ? `${bestFeeling} most often lines up with a better post-meal feeling.` : "Tag meals with how they felt to build food memory.",
    },
    {
      title: "Water and headaches",
      copy: lowWaterHeadaches ? `${lowWaterHeadaches} headache logs happened before hitting the water goal.` : "No water-headache pattern is visible yet.",
    },
  ];
}

function getWeeklyStory(data: AppData) {
  const days = lastDays(7);
  const workouts = data.workoutLogs.filter((log) => days.includes(log.loggedAt.slice(0, 10)));
  const waterWins = days.filter((date) => data.waterLogs.filter((log) => log.loggedAt.startsWith(date)).reduce((sum, log) => sum + log.amountMl, 0) >= data.profile.waterGoal * 250).length;
  const bestSleep = data.mentalLogs.filter((log) => days.includes(log.date)).sort((a, b) => b.sleepHours - a.sleepHours)[0];
  const avgMood = average(data.mentalLogs.filter((log) => days.includes(log.date)).map((log) => log.mood));
  const symptomCount = data.symptomLogs.filter((log) => days.includes(log.loggedAt.slice(0, 10))).length;
  return {
    title: `${workouts.length} workouts, ${waterWins} water wins`,
    copy: `This week averaged ${avgMood ? avgMood.toFixed(1) : "0.0"}/10 mood${bestSleep ? `, with best sleep on ${shortDay(bestSleep.date)} at ${bestSleep.sleepHours}h` : ""}. You logged ${symptomCount} symptom note${symptomCount === 1 ? "" : "s"}.`,
  };
}

function getCheckInPrompts(data: AppData) {
  const yesterday = lastDays(2)[0];
  const yesterdayPain = data.symptomLogs.filter((log) => log.loggedAt.startsWith(yesterday)).sort((a, b) => b.severity - a.severity)[0];
  const lastMental = data.mentalLogs.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
  const prompts = [];
  if (yesterdayPain) prompts.push(`Yesterday's ${yesterdayPain.bodyLocation.toLowerCase()} was ${yesterdayPain.severity}/10. How is it today?`);
  if (lastMental?.sleepHours && lastMental.sleepHours < 6.5) prompts.push(`Sleep was ${lastMental.sleepHours}h last check-in. Watch today's energy.`);
  if (!prompts.length) prompts.push("What changed in your body since yesterday?");
  return prompts;
}

function symptomHeat(logs: AppData["symptomLogs"]) {
  const counts = new Map<string, number>();
  logs.forEach((log) => counts.set(log.bodyLocation, (counts.get(log.bodyLocation) ?? 0) + 1));
  return Array.from(counts, ([location, count]) => ({ location, count })).sort((a, b) => b.count - a.count).slice(0, 6);
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function mostCommon(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

function clampScore(value: number) {
  return Math.min(100, Math.max(0, value));
}

function timeLabel(value: string) {
  return new Date(value).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function moodEmoji(value: number) {
  return value >= 9 ? "😁" : value >= 7 ? "🙂" : value >= 5 ? "😐" : value >= 3 ? "😟" : "😢";
}

function mealSuggestions(data: AppData, meal: MealTag): FoodItem[] {
  const mealLogs = data.foodLogs.filter((log) => log.mealTag === meal);
  const byName = new Map<string, FoodItem & { score: number; lastLogged: string }>();

  mealLogs.forEach((log) => {
    const key = log.name.toLowerCase();
    const existing = byName.get(key);
    if (!existing) {
      byName.set(key, { ...log, timesLogged: 1, score: 1, lastLogged: log.loggedAt });
      return;
    }
    byName.set(key, {
      ...existing,
      calories: log.calories,
      protein: log.protein,
      fiber: log.fiber,
      score: existing.score + 1,
      lastLogged: log.loggedAt > existing.lastLogged ? log.loggedAt : existing.lastLogged,
    });
  });

  const loggedSuggestions = Array.from(byName.values())
    .sort((a, b) => b.score - a.score || b.lastLogged.localeCompare(a.lastLogged))
    .slice(0, 6);

  if (loggedSuggestions.length) return loggedSuggestions;

  return data.foodLibrary
    .slice()
    .sort((a, b) => b.timesLogged - a.timesLogged)
    .slice(0, 6);
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
