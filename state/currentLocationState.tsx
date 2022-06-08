import create from "zustand";

interface CurrentLocationState {
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  setCurrentLocation: ({
    latitude,
    longitude
  }: {
    latitude: number;
    longitude: number;
  }) => void;
}

export const useCurrentLocationStore = create<CurrentLocationState>(set => ({
  currentLocation: { latitude: 45.464211, longitude: 9.191383 },
  setCurrentLocation: ({
    latitude,
    longitude
  }: {
    latitude: number;
    longitude: number;
  }) => set({ currentLocation: { latitude, longitude } })
}));
