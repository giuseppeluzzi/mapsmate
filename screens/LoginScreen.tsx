import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import * as React from "react";
import {
  StyleSheet,
  View,
  Touchable,
  TouchableOpacity,
  Button,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import tailwind from "tailwind-rn";
import { Text } from "../components/Themed";
import { RootStackParamList, RootStackScreenProps } from "../types";

export default function WelcomeScreen({
  navigation
}: NativeStackScreenProps<RootStackParamList, "Welcome">) {
  return (
    <SafeAreaView style={tailwind("bg-gray-100 pt-6")}>
      <View style={tailwind("px-8 ")}>
        <View style={tailwind("items-end")}>
          <TouchableOpacity>
            <Text style={tailwind("font-medium")}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Text style={tailwind("pt-16 font-medium text-4xl")}>Login</Text>
        <Text style={tailwind("pt-2 font-light")}>Welcome back!</Text>

        <View style={tailwind("pt-10")}>
          <Text style={tailwind("uppercase font-medium text-sm")}>Email</Text>
          <TextInput
            style={tailwind(
              "mt-2 py-4 px-6 font-medium text-black bg-white rounded-lg"
            )}
            value="peppe.luzzi@gmail.com"
          />
        </View>
        <View style={tailwind("pt-6")}>
          <Text style={tailwind("uppercase font-medium text-sm")}>
            Password
          </Text>
          <TextInput
            secureTextEntry={true}
            style={tailwind(
              "mt-2 py-4 px-6 font-medium text-black bg-white rounded-lg"
            )}
            value="password"
          />
        </View>
      </View>
      <TouchableOpacity
        style={tailwind("self-end w-3/4 pt-10")}
        /*onPress={async () => {
          await signInWithEmailAndPassword(
            getAuth(),
            "peppe.luzzi@gmail.com",
            "ciaociao"
          );
        }}*/
      >
        <View
          style={tailwind(
            "flex-row items-center justify-between px-6 py-4 bg-yellow-400 rounded-tl-lg rounded-bl-lg"
          )}
        >
          <Text style={tailwind("font-medium text-lg")}>Log In</Text>
          <Svg
            style={tailwind("h-6 w-6 text-black")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </Svg>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
