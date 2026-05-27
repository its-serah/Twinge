import { AppData } from "./types";
import { todayKey, uid } from "./date";

const today = todayKey();

export const defaultData: AppData = {
  profile: {
    name: "Serah",
    weight: 62,
    height: 165,
    fatMass: 16,
    leanMass: 43,
    waterMass: 34,
    calorieGoal: 2100,
    stepGoal: 10000,
    waterGoal: 8,
    waterUnit: "glasses",
    goal: "Improve energy",
    foodSetupDone: false,
    workoutTypes: ["Leg day", "Push day", "Pull day", "Full body", "Cardio", "Yoga"],
  },
  foodLibrary: [
    { id: uid("food"), name: "Greek yogurt", calories: 130, protein: 17, fiber: 0, timesLogged: 3 },
    { id: uid("food"), name: "Chicken rice bowl", calories: 520, protein: 38, fiber: 5, timesLogged: 5 },
    { id: uid("food"), name: "Banana", calories: 105, protein: 1, fiber: 3, timesLogged: 8 },
    { id: uid("food"), name: "Protein shake", calories: 180, protein: 28, fiber: 1, timesLogged: 4 },
  ],
  foodLogs: [
    { id: uid("log"), name: "Greek yogurt", calories: 130, protein: 17, fiber: 0, timesLogged: 3, mealTag: "Breakfast", loggedAt: `${today}T08:15:00` },
    { id: uid("log"), name: "Chicken rice bowl", calories: 520, protein: 38, fiber: 5, timesLogged: 5, mealTag: "Lunch", loggedAt: `${today}T13:20:00` },
  ],
  workoutLogs: [
    {
      id: uid("workout"),
      type: "Leg day",
      exercises: [
        { name: "Squat", sets: 4, reps: 8, weight: 50 },
        { name: "Calf raise", sets: 3, reps: 12, weight: 20 },
      ],
      durationMinutes: 55,
      intensity: "Medium",
      notes: "Slight shin tightness after treadmill warmup.",
      loggedAt: `${today}T18:00:00`,
    },
  ],
  symptomLogs: [
    {
      id: uid("symptom"),
      name: "Shin splint",
      type: "Tightness",
      severity: 4,
      bodyLocation: "Shin",
      notes: "After leg day",
      loggedAt: `${today}T19:10:00`,
    },
  ],
  mentalLogs: [{ date: today, mood: 7, energy: 6, sleepHours: 7.5, waterGlasses: 4, journal: "" }],
  stepLogs: [{ date: today, stepCount: 6200 }],
  waterLogs: [
    { id: uid("water"), amountMl: 250, loggedAt: `${today}T09:00:00` },
    { id: uid("water"), amountMl: 500, loggedAt: `${today}T13:30:00` },
  ],
};
