import { create } from "zustand";

type State = {
  token: string | null;
  setToken: (t: string | null) => void;
};

// Safe localStorage access (check if window exists)
const getStoredToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const useAuthStore = create<State>((set) => ({
  token: getStoredToken(),
  setToken: (t) => {
    if (typeof window !== "undefined") {
      if (t) localStorage.setItem("token", t);
      else localStorage.removeItem("token");
    }
    set({ token: t });
  },
}));

export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}
