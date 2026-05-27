import { AppData } from "./types";
import { defaultData } from "./seed";

const KEY = "twinge:data:v1";

export function loadData(): AppData {
  const raw = localStorage.getItem(KEY);
  if (!raw) return defaultData;

  try {
    return { ...defaultData, ...JSON.parse(raw) } as AppData;
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function exportJson(data: AppData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `twinge-export-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
