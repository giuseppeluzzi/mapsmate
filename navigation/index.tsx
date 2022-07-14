/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Platform, Settings } from "react-native";

import LoginScreen from "../screens/LoginScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import POIScreen from "screens/POIScreen";
import { useStore } from "../state/userState";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

import SignUpScreen from "../screens/SignUpScreen";
import Svg, { Path, Rect } from "react-native-svg";
import ProfileTabScreen from "../screens/ProfileTabScreen";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  useTheme,
} from "native-base";
import MapScreen from "screens/MapScreen";
import ExploreScreen from "screens/ExploreScreen";
import SettingsScreen from "screens/SettingsScreen";
import UserScreen from "screens/UserScreen";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import TheForkBookScreen from "screens/TheForkBookScreen";
import useIsTablet from "hooks/useIsTablet";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const theme = useTheme();

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={{
        dark: useColorModeValue(false, true),
        colors: {
          primary: theme.colors.primary[300],
          background: useColorModeValue(
            theme.colors.gray[100],
            theme.colors.gray[900]
          ),
          card: useColorModeValue(theme.colors.white, theme.colors.black),
          text: useColorModeValue(theme.colors.muted[700], theme.colors.white),
          border: useColorModeValue(
            theme.colors.gray[100],
            theme.colors.gray[900]
          ),
          notification: theme.colors.primary[300],
        },
      }}
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
  const navigation = useNavigation();
  const theme = useTheme();

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
          <Stack.Group
            screenOptions={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerBlurEffect: "regular",
              header: ({ route, options }) => (
                <SafeAreaInsetsContext.Consumer>
                  {(insets) => (
                    <HStack
                      style={{
                        height: 60,
                        marginTop: Platform.OS != "ios" ? insets?.top ?? 0 : 0,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                      bg={"primary.300"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <Text
                        color={"primary"}
                        fontWeight={"bold"}
                        fontSize={"md"}
                      >
                        {options.title ?? route.name}
                      </Text>

                      <Button
                        onPress={() => {
                          navigation.goBack();
                        }}
                        position={"absolute"}
                        right={4}
                        variant={"white"}
                        rounded={16}
                        paddingX={0}
                        paddingY={0}
                        height={10}
                        width={10}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <Icon viewBox="0 0 24 24">
                          <Path
                            fill="#1E1F20"
                            fill-rule="evenodd"
                            d="M6.34309 4.92888 12 10.585l5.6568-5.65612c.3905-.39052 1.0237-.39052 1.4142 0 .3905.39052.3905 1.02369 0 1.41421L13.415 12l5.656 5.6568c.3905.3905.3905 1.0237 0 1.4142-.3905.3905-1.0237.3905-1.4142 0L12 13.415l-5.65691 5.656c-.39052.3905-1.02369.3905-1.41421 0s-.39052-1.0237 0-1.4142L10.585 12 4.92888 6.34309c-.39052-.39052-.39052-1.02369 0-1.41421s1.02369-.39052 1.41421 0Z"
                            clip-rule="evenodd"
                          />
                        </Icon>
                      </Button>
                    </HStack>
                  )}
                </SafeAreaInsetsContext.Consumer>
              ),
              headerStyle: {},
              contentStyle: {
                //paddingHorizontal: theme.space[6],
              },
            }}
          >
            <Stack.Screen
              name="Settings"
              options={{ headerShown: true, title: "Settings" }}
              component={SettingsScreen}
            />
            <Stack.Screen
              name="User"
              component={UserScreen}
              options={{ title: "" }}
            />
            <Stack.Screen
              name="POI"
              component={POIScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="TheForkBookScreen"
              component={TheForkBookScreen}
              options={{ headerShown: true, title: "Book now" }}
            />
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
  const { isTablet } = useIsTablet();

  return (
    <BottomTab.Navigator
      initialRouteName="MapTab"
      screenOptions={{
        headerTitle: ({ children }) => (
          <Heading
            size={"2xl"}
            color={"black"}
            _dark={{ color: "gray.100" }}
            fontWeight={700}
          >
            {children}
          </Heading>
        ),
        headerStyle: {
          borderBottomWidth: 0,
          shadowOpacity: 0,
          height: 116,
          backgroundColor: useColorModeValue("#f9f9f9", theme.colors.gray[900]),
        },
        headerLeftContainerStyle: {
          paddingLeft: theme.space[2],
        },
        headerRightContainerStyle: {
          paddingRight: 22,
        },
        headerTitleAlign: "left",
        tabBarStyle: {
          position: "absolute",
          height: 100,
          paddingTop: theme.space[1],
          backgroundColor: useColorModeValue(
            theme.colors.gray[100],
            theme.colors.gray[900]
          ),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarLabelStyle: {
          // marginBottom: -theme.space[0]
          // paddingTop: theme.space[3]
        },
        tabBarActiveTintColor: useColorModeValue(
          theme.colors.gray[900],
          theme.colors.gray[100]
        ),
        tabBarInactiveTintColor: useColorModeValue(
          theme.colors.gray[700],
          theme.colors.gray[300]
        ),
      }}
    >
      <BottomTab.Screen
        name="ExploreTab"
        component={ExploreScreen}
        options={({ navigation }: RootTabScreenProps<"ExploreTab">) => ({
          title: "Explore",
          header: () => null,
          tabBarIcon: ({ focused, color }) => (
            <Box
              bg={focused ? "primary.400" : "transparent"}
              borderRadius={"full"}
              p={1.5}
              marginBottom={focused || isTablet ? 0 : -4}
              marginRight={isTablet ? 8 : 0}
            >
              <Svg fill="none" height={32} width={32}>
                <Path
                  stroke={color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m28 28.5-8-8 8 8Zm-5.3333-14.6667c0 1.2257-.2414 2.4394-.7105 3.5717a9.3324 9.3324 0 0 1-2.0232 3.028 9.3324 9.3324 0 0 1-3.028 2.0232 9.33188 9.33188 0 0 1-3.5717.7105 9.33246 9.33246 0 0 1-3.57168-.7105 9.3323 9.3323 0 0 1-3.02795-2.0232 9.33339 9.33339 0 0 1-2.02321-3.028A9.33278 9.33278 0 0 1 4 13.8333c0-2.4753.98333-4.84929 2.73367-6.59963C8.48401 5.48333 10.858 4.5 13.3333 4.5c2.4754 0 4.8494.98333 6.5997 2.73367 1.7503 1.75034 2.7337 4.12433 2.7337 6.59963Z"
                />
              </Svg>
            </Box>
          ),
        })}
      />
      <BottomTab.Screen
        name="MapTab"
        component={MapScreen}
        options={({ navigation }: RootTabScreenProps<"MapTab">) => ({
          title: "Map",
          header: () => null,
          tabBarIcon: ({ focused, color }) => (
            <Box
              bg={focused ? "primary.400" : "transparent"}
              borderRadius={"full"}
              p={1.5}
              marginBottom={focused || isTablet ? 0 : -4}
              marginRight={isTablet ? 8 : 0}
            >
              <Svg fill="none" height={32} width={32}>
                <Path
                  stroke={color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="m23.5427 22.7293-5.6574 5.6574a2.66378 2.66378 0 0 1-.8646.5781 2.66304 2.66304 0 0 1-2.0401 0 2.66378 2.66378 0 0 1-.8646-.5781l-5.65868-5.6574a10.6665 10.6665 0 0 1-2.312-11.6243A10.66646 10.66646 0 0 1 10.074 6.318a10.66668 10.66668 0 0 1 11.852 0 10.66629 10.66629 0 0 1 3.9286 4.787 10.66552 10.66552 0 0 1 .6071 6.1628 10.66643 10.66643 0 0 1-2.919 5.4615v0Z"
                />
                <Path
                  stroke={color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M20 15.1866a3.99992 3.99992 0 0 1-4 4 3.99992 3.99992 0 0 1-4-4c0-1.0608.4214-2.0782 1.1716-2.8284A4.00002 4.00002 0 0 1 16 11.1866c1.0609 0 2.0783.4215 2.8284 1.1716A3.99994 3.99994 0 0 1 20 15.1866v0Z"
                />
              </Svg>
            </Box>
          ),
        })}
      />
      <BottomTab.Screen
        name="ProfileTab"
        component={ProfileTabScreen}
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Box
              bg={focused ? "primary.400" : "transparent"}
              borderRadius={"full"}
              p={1.5}
              marginBottom={focused || isTablet ? 0 : -4}
              marginRight={isTablet ? 8 : 0}
            >
              <Svg fill="none" height={32} width={32}>
                <Path
                  stroke={color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21.3333 9.83333a5.33343 5.33343 0 0 1-1.5621 3.77127A5.33322 5.33322 0 0 1 16 15.1667c-1.4145 0-2.7711-.5619-3.7712-1.5621a5.33343 5.33343 0 0 1-1.5621-3.77127 5.3333 5.3333 0 0 1 1.5621-3.77123C13.2289 5.0619 14.5855 4.5 16 4.5c1.4145 0 2.771.5619 3.7712 1.5621a5.3333 5.3333 0 0 1 1.5621 3.77123v0ZM16 19.1667c-2.4754 0-4.8493.9833-6.59967 2.7336-1.75034 1.7504-2.73367 4.1243-2.73367 6.5997H25.3333c0-2.4754-.9833-4.8493-2.7336-6.5997C20.8493 20.15 18.4753 19.1667 16 19.1667v0Z"
                />
              </Svg>
            </Box>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
