import { action, createStore, persist } from "easy-peasy";
import type { Action } from "easy-peasy";
import type { User, Payload } from "../type";
import ls from "localstorage-slim";

export interface EasyPeasyStore {
  isAuthenticated: boolean;
  roles: string[];
  isSideMenuOpen: boolean;
  setting: string;
  settings: string[];
  activeSettingsTab: string;
  user: User;
  addUser: Action<EasyPeasyStore, Payload>;
  setUserId: Action<EasyPeasyStore, string>;
  setAuthenticated: Action<EasyPeasyStore, boolean>;
  logout: Action<EasyPeasyStore>;
  token: string;
}

const initialState = {
  isSideMenuOpen: true,
  token: "",
  setting: "profile",
  settings: [] as string[],
  activeSettingsTab: "Profile",
  isAuthenticated: false,
  roles: [] as string[],
  user: {
    email: "",
    name: "",
    id: "",
  },
};

export const store = createStore<EasyPeasyStore>(
  persist(
    {
      ...initialState,

      addUser: action((state: unknown, payload: Payload) => {
        (state as Record<string, unknown>).user = payload.user;
        (state as Record<string, unknown>).token = payload.token;
        (state as Record<string, unknown>).roles = payload.roles;
        (state as Record<string, unknown>).setting = payload.setting;
        (state as Record<string, unknown>).settings = payload.settings || [];
      }),

      setUserId: action((state: unknown, payload: string) => {
        const u = (state as Record<string, unknown>).user as Record<string, unknown>;
        if (u) u.id = payload;
      }),

      setAuthenticated: action((state: unknown, payload: boolean) => {
        (state as Record<string, unknown>).isAuthenticated = payload;
      }),

      logout: action((state: unknown) => {
        const s = state as Record<string, unknown>;
        s.user = { email: "", id: "", name: "" };
        s.token = "";
        s.isAuthenticated = false;
        s.settings = [];
        s.activeSettingsTab = "Profile";
      }),
    },
    {
      storage: {
        getItem: async (key) => {
          const value = ls.get(key, { decrypt: true });
          return value as string | null;
        },
        setItem: (key, value) => {
          ls.set(key, value);
        },
        removeItem: (key) => {
          ls.remove(key);
        },
      },
      allow: [
        "user",
        "isAuthenticated",
        "isSideMenuOpen",
        "token",
        "setting",
        "settings",
        "roles",
        "activeSettingsTab",
      ],
    }
  ),
  { name: "client-dashboard" }
);
