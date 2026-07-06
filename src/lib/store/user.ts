"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  phone: string;
  name: string;
  setProfile: (phone: string, name?: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      phone: "",
      name: "",
      setProfile: (phone, name = "") => set({ phone, name }),
      logout: () => set({ phone: "", name: "" }),
    }),
    { name: "tzipypuff-user" }
  )
);

export function calcClubPoints(ordersTotal: number): number {
  return Math.floor(ordersTotal / 10);
}
