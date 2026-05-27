export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function isToday(iso: string) {
  return iso.slice(0, 10) === todayKey();
}

export function lastDays(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - index - 1));
    return todayKey(date);
  });
}

export function shortDay(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" });
}

export function uid(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}
