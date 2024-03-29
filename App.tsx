import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import { loadUserProfile, supabase } from "./lib/supabase";
import { useStore } from "./state/userState";

import FlashMessage from "react-native-flash-message";
import { extendTheme, NativeBaseProvider, useTheme } from "native-base";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

import "react-native-url-polyfill/auto";
import "react-native-get-random-values";

import { QueryClient, QueryClientProvider } from "react-query";

import { PortalProvider } from "@gorhom/portal";

import { LogBox, Platform, View } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as ScreenOrientation from "expo-screen-orientation";

LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["NativeBase:"]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

// ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [authCheckCompleted, setAuthCheckCompleted] = useState<boolean>(false);

  const { setUser } = useStore();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user && event !== "SIGNED_IN") {
          loadUserProfile(session.user.id).then((user) => {
            setUser(user);
          });
        } else if (event == "SIGNED_OUT") {
          setUser(null);
        }
        setAuthCheckCompleted(true);
      }
    );

    AsyncStorage.getItem("auth/refresh_token").then(async (value) => {
      if (value) {
        const { session, error } = await supabase.auth.signIn({
          refreshToken: value,
        });

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

  const theme = extendTheme({
    colors: {
      gray: {
        100: "#f9f9f9",
      },
      // Primary custom
      primary: {
        50: "#fff6db",
        100: "#ffe5af",
        200: "#ffd47f",
        300: "#ffc34d",
        400: "#ffb21d",
        500: "#e69805",
        600: "#b37600",
        700: "#805400",
        800: "#4e3300",
        900: "#1e1000",
      },
      // Primary yellow
      /*primary: {
        50: "#fefce8",
        100: "#fef9c3",
        200: "#fef08a",
        300: "#fde047",
        400: "#facc15",
        500: "#eab308",
        600: "#ca8a04",
        700: "#a16207",
        800: "#854d0e",
        900: "#713f12"
      }*/
      // Primary amber
      /*primary: {
        50: "#fffbeb",
        100: "#fef3c7",
        200: "#fde68a",
        300: "#fcd34d",
        400: "#fbbf24",
        500: "#f59e0b",
        600: "#d97706",
        700: "#b45309",
        800: "#92400e",
        900: "#78350f",
      }*/
    },
    components: {
      Button: {
        baseStyle: {
          rounded: "full",
        },
        variants: {
          primary: (props: any) => {
            const styleObject = {
              bg: "primary.300",
              _hover: {
                bg: "primary.500",
              },
              _pressed: {
                bg: "primary.500",
              },
            };

            return styleObject;
          },
          primaryOutline: (props: any) => {
            const styleObject = {
              bg: "transparent",
              borderColor: "primary.500",
              borderWidth: 2,
              _hover: {
                bg: "primary.500",
              },
              _pressed: {
                bg: "primary.500",
              },
            };

            return styleObject;
          },
          ghost: (props: any) => {
            const styleObject = {
              bg: "transparent",
              _hover: {
                bg: "primary.500",
              },
              _pressed: {
                bg: "primary.500",
              },
            };

            return styleObject;
          },
          white: (props: any) => {
            const styleObject = {
              bg: "white",
              _hover: {
                bg: "gray.100",
              },
              _pressed: {
                bg: "gray.100",
              },
            };

            return styleObject;
          },
        },
        defaultProps: {
          variant: "primary",
          _text: {
            fontWeight: "bold",
            paddingX: 3.5,
            paddingY: 0.5,
            color: "black",
          },
        },
      },
      IconButton: {
        baseStyle: {
          rounded: "16",
          color: "black",
        },
        variants: {
          primary: (props: any) => {
            const styleObject = {
              _web: {
                outlineWidth: 0,
              },
              bg: "primary.300",
              _hover: {
                bg: "primary.500",
              },
              _pressed: {
                bg: "primary.500",
              },
            };

            return styleObject;
          },
          white: (props: any) => {
            const styleObject = {
              bg: "white",
              _hover: {
                bg: "gray.100",
              },
              _pressed: {
                bg: "gray.100",
              },
            };

            return styleObject;
          },
        },
      },
      Input: {
        defaultProps: {
          borderWidth: 0,
          bg: "white",
          fontSize: "md",
        },
      },
    },
    fontConfig: {
      NunitoSans: {
        200: {
          normal: "NunitoSans_200ExtraLight",
          italic: "NunitoSans_200ExtraLight_Italic",
        },
        300: {
          normal: "NunitoSans_300Light",
          italic: "NunitoSans_300Light_Italic",
        },
        400: {
          normal: "NunitoSans_400Regular",
          italic: "NunitoSans_400Regular_Italic",
        },
        600: {
          normal: "NunitoSans_600SemiBold",
          italic: "NunitoSans_600SemiBold_Italic",
        },
        700: {
          normal: "NunitoSans_700Bold",
          italic: "NunitoSans_700Bold_Italic",
        },
        800: {
          normal: "NunitoSans_800ExtraBold",
          italic: "NunitoSans_800ExtraBold_Italic",
        },
        900: {
          normal: "NunitoSans_900Black",
          italic: "NunitoSans_900Black_Italic",
        },
      },
    },
    fonts: {
      heading: "NunitoSans",
      body: "NunitoSans",
    },
    config: {
      initialColorMode: "light",
      useSystemColorMode: false,
    },
  });

  if (!isLoadingComplete || !authCheckCompleted) {
    return <AppLoading />;
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider
          theme={theme}
          initialWindowMetrics={{
            frame: { x: 0, y: 0, width: 0, height: 0 },
            insets: { top: 0, left: 0, right: 0, bottom: 0 },
          }}
        >
          <SafeAreaProvider>
            <PortalProvider>
              <View style={{ flex: 1 }}>
                <Navigation colorScheme={colorScheme} />
                <StatusBar style={"dark"} />
                <SafeAreaInsetsContext.Consumer>
                  {(insets) => (
                    <FlashMessage
                      position="top"
                      style={{
                        //paddingHorizontal: 32,
                        paddingTop:
                          Platform.OS != "ios" ? (insets?.top ?? 0) + 5 : 0,
                      }}
                    />
                  )}
                </SafeAreaInsetsContext.Consumer>
              </View>
            </PortalProvider>
          </SafeAreaProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    );
  }
}
