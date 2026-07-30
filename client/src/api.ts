const TOKEN_KEY = "pbcm_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.headers) Object.assign(headers, options.headers);

  const res = await fetch(`/api${path}`, { ...options, headers });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? `Request failed (${res.status}).`);
  }
  return body as T;
}

export const api = {
  register: (email: string, password: string, referralCode?: string) =>
    request<{ token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, referralCode }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request<import("./types").Me>("/auth/me"),

  submitAudit: (payload: unknown) =>
    request("/profile", { method: "POST", body: JSON.stringify(payload) }),

  getExposure: () => request<import("./types").ExposureAudit>("/exposure"),
  saveExposureDraft: (text: string) =>
    request<import("./types").ExposureAudit>("/exposure/draft", { method: "PUT", body: JSON.stringify({ text }) }),
  registerExposure: () => request<import("./types").ExposureAudit>("/exposure/register", { method: "POST" }),

  getJournal: () => request<import("./types").JournalEntry[]>("/journal"),
  addJournalEntry: (tags: string[], text: string) =>
    request<import("./types").JournalEntry>("/journal", { method: "POST", body: JSON.stringify({ tags, text }) }),

  getHabits: () => request<import("./types").Habit[]>("/habits"),
  getHabitPresets: () => request<string[]>("/habits/presets"),
  addHabit: (name: string) => request<import("./types").Habit>("/habits", { method: "POST", body: JSON.stringify({ name }) }),
  toggleHabit: (id: string) => request<{ checkedToday: boolean }>(`/habits/${id}/toggle`, { method: "POST" }),

  getGates: () => request<import("./types").Gates>("/gates"),
  getGateHistory: (days = 14) =>
    request<{ date: string; journal: boolean; habits: boolean }[]>(`/gates/history?days=${days}`),

  getCircle: () => request<import("./types").CircleData>("/circle"),
  exportMetrics: () => request<unknown>("/circle/export"),

  getNotifications: () => request<import("./types").NotificationSettings>("/notifications"),
  patchNotifications: (patch: Partial<import("./types").NotificationSettings>) =>
    request<import("./types").NotificationSettings>("/notifications", { method: "PATCH", body: JSON.stringify(patch) }),

  devPersona: (persona: string) => request<{ ok: true }>("/dev/persona", { method: "POST", body: JSON.stringify({ persona }) }),
};
