import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import { supabase } from "./lib/supabase";
import { useStore } from "./state/userState";

import FlashMessage from "react-native-flash-message";
import { NativeBaseProvider } from "native-base";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [authCheckCompleted, setAuthCheckCompleted] = useState<boolean>(false);

  const { setUser } = useStore();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event);
        if (session && session.user) {
          setUser(session.user);
        } else if (event == "SIGNED_OUT") {
          setUser(null);
        }
        setAuthCheckCompleted(true);
      }
    );

    AsyncStorage.getItem("auth/refresh_token").then(async value => {
      if (value) {
        const { session, error } = await supabase.auth.setSession(value);
        if (error) {
          AsyncStorage.removeItem("auth/refresh_token");
          setAuthCheckCompleted(true);
        }

        if (session && session.refresh_token) {
          AsyncStorage.setItem("auth/refresh_token", session.refresh_token);
        }
      } else {
        setAuthCheckCompleted(true);
      }
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  if (!isLoadingComplete || !authCheckCompleted) {
    return null;
  } else {
    return (
      <NativeBaseProvider>
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
      </NativeBaseProvider>
    );
  }
}
