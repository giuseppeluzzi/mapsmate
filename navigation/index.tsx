/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import LoginScreen from "../screens/LoginScreen";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { useStore } from "../state/userState";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

import SignUpScreen from "../screens/SignUpScreen";
import Svg, { Path, Rect } from "react-native-svg";
import ProfileTabScreen from "../screens/ProfileTabScreen";
import GroupsTabScreens from "../screens/GroupsTabScreens";
import { Heading, useTheme } from "native-base";

export default function Navigation({
  colorScheme
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { user } = useStore();

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Root"
            component={HomeBottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: "Oops!" }}
          />
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function HomeBottomTabNavigator() {
  const theme = useTheme();

  return (
    <BottomTab.Navigator
      initialRouteName="GroupsTab"
      screenOptions={{
        headerTitle: ({ children }) => (
          <Heading size={"2xl"} paddingX={2} color={"black"} fontWeight={700}>
            {children}
          </Heading>
        ),
        headerStyle: {
          borderBottomWidth: 0,
          shadowOpacity: 0,
          height: 116,
          backgroundColor: theme.colors.gray[100]
        },
        headerTitleAlign: "left",
        tabBarStyle: {
          paddingTop: theme.space[4],
          backgroundColor: theme.colors.gray[100]
        },
        tabBarLabelStyle: {
          marginBottom: -theme.space[1],
          paddingTop: theme.space[3]
        },
        tabBarActiveTintColor: theme.colors.gray[900],
        tabBarInactiveTintColor: theme.colors.gray[700]
      }}
    >
      <BottomTab.Screen
        name="GroupsTab"
        component={GroupsTabScreens}
        options={({ navigation }: RootTabScreenProps<"GroupsTab">) => ({
          title: "Groups",
          tabBarIcon: ({ focused, color }) => (
            <Svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <Rect opacity="0.01" width="28" height="28" fill="black" />
              <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15.8021 9.2619C15.8021 12.1634 13.4984 14.5238 10.6667 14.5238C7.83554 14.5238 5.53125 12.1634 5.53125 9.2619C5.53125 6.36043 7.83494 4 10.6667 4C13.4984 4 15.8021 6.36043 15.8021 9.2619ZM1 24.8312C1 20.1719 5.33671 16.381 10.6667 16.381C15.9972 16.381 20.3333 20.1719 20.3333 24.8312C20.3333 26.5788 18.7075 28 16.7083 28H4.625C2.62581 28 1 26.5788 1 24.8312ZM24 17C26.2056 17 28 15.2056 28 13C28 10.7944 26.2056 9 24 9C21.7944 9 20 10.7944 20 13C20 15.2056 21.7948 17 24 17ZM31 25.5455C31 21.9365 27.6358 19 23.5 19C22.7271 19 21.9812 19.1026 21.2786 19.2934C22.5654 21.0229 23.3333 23.2002 23.3333 25.5628C23.3333 26.4891 23.0187 27.3393 22.4961 28.0011L28.1875 28L28.3651 27.9952C29.8338 27.9149 31 26.8471 31 25.5455Z"
                fill={focused ? theme.colors.gray[900] : "none"}
                stroke={color}
                strokeWidth="1.5"
              />
            </Svg>
          )

          /*headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          )*/
        })}
      />
      <BottomTab.Screen
        name="ProfileTab"
        component={ProfileTabScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <Rect opacity="0.01" width="28" height="28" fill="black" />
              <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 6.66C4 5.19067 5.19067 4 6.66 4H25.34C26.8093 4 28 5.19067 28 6.66V25.34C28 26.8091 26.8091 28 25.34 28H6.66C5.19092 28 4 26.8091 4 25.34V6.66ZM8 24H24C22.1787 21.4923 19.19 19.998 16 20C12.81 19.998 9.8213 21.4923 8 24ZM16 18C18.7614 18 21 15.7614 21 13C21 10.2386 18.7614 8 16 8C13.2386 8 11 10.2386 11 13C11 15.7614 13.2386 18 16 18Z"
                fill={focused ? theme.colors.gray[900] : "none"}
                stroke={color}
                strokeWidth="1.5"
              />
            </Svg>
          )
        }}
      />
    </BottomTab.Navigator>
  );
}
