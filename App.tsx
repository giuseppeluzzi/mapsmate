import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import "./firebase";
import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import { useStore } from "./state/userState";

import FlashMessage from "react-native-flash-message";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [authCheckCompleted, setAuthCheckCompleted] = useState<boolean>(false);

  const { setUser } = useStore();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      getAuth(),
      async authenticatedUser => {
        try {
          await (authenticatedUser
            ? setUser(authenticatedUser)
            : setUser(null));
          setAuthCheckCompleted(true);
        } catch (error) {
          console.log(error);
        }
      }
    );

    return unsubscribeAuth;
  }, []);

  if (!isLoadingComplete || !authCheckCompleted) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
        <FlashMessage
          position="top"
          style={{
            paddingHorizontal: 32
          }}
        />
      </SafeAreaProvider>
    );
  }
}
