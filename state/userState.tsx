import { User } from "@firebase/auth";
import create from "zustand";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<UserState>(set => ({
  user: null,
  setUser: (user: User | null) => set({ user: user })
}));
