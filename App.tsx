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
import tailwind from "tailwind-rn";
import { NativeBaseProvider } from "native-base";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import { View } from "./components/Themed";
import LoginScreen from "./screens/LoginScreen";

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


/*export default function App(){
  const [session, setSession] = useState<Session | null>(null)

  useEffect( ()=> {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return null
}
*/