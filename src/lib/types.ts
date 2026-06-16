export type MealTag = "Breakfast" | "Lunch" | "Dinner" | "Snacks";
export type MealFeeling = "Felt good" | "Energized" | "Bloated" | "Crashed" | "Heavy" | "Neutral";
export type SymptomType = "Soreness" | "Tightness" | "Sharp pain" | "Ache" | "Other";
export type Intensity = "Low" | "Medium" | "High";
export type HealthGoal = "Lose weight" | "Maintain" | "Gain muscle" | "Improve energy";
export type UnitPreference = "glasses" | "ml";

export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fiber: number;
  timesLogged: number;
};

export type FoodLog = FoodItem & {
  mealTag: MealTag;
  feeling?: MealFeeling;
  loggedAt: string;
};

export type Exercise = {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
};

export type WorkoutLog = {
  id: string;
  type: string;
  exercises: Exercise[];
  durationMinutes: number;
  intensity: Intensity;
  notes: string;
  loggedAt: string;
};

export type SymptomLog = {
  id: string;
  name: string;
  type: SymptomType;
  severity: number;
  bodyLocation: string;
  notes: string;
  loggedAt: string;
};

export type MentalLog = {
  date: string;
  mood: number;
  energy: number;
  sleepHours: number;
  waterGlasses: number;
  journal: string;
};

export type StepLog = {
  date: string;
  stepCount: number;
};

export type WaterLog = {
  id: string;
  amountMl: number;
  loggedAt: string;
};

export type Profile = {
  name: string;
  weight: number;
  height: number;
  fatMass: number;
  leanMass: number;
  waterMass: number;
  calorieGoal: number;
  stepGoal: number;
  waterGoal: number;
  waterUnit: UnitPreference;
  goal: HealthGoal;
  foodSetupDone: boolean;
  workoutTypes: string[];
};

export type AppData = {
  profile: Profile;
  foodLibrary: FoodItem[];
  foodLogs: FoodLog[];
  workoutLogs: WorkoutLog[];
  symptomLogs: SymptomLog[];
  mentalLogs: MentalLog[];
  stepLogs: StepLog[];
  waterLogs: WaterLog[];
};
