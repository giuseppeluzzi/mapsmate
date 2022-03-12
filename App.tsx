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

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  // const [authCheckCompleted, setAuthCheckCompleted] = useState<boolean>(true);

  const { setUser } = useStore();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event);
        if ((event == "SIGNED_IN" || event == "USER_UPDATED") && session) {
          setUser(session.user);
        } else if (event == "SIGNED_OUT") {
          setUser(null);
        }
        // setAuthCheckCompleted(true);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  if (!isLoadingComplete /*|| !authCheckCompleted*/) {
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
