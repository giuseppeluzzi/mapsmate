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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text style={tailwind("font-medium")}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Text style={tailwind("pt-16 font-medium text-4xl")}>Login</Text>
        <Text style={tailwind("pt-2 font-light")}>Welcome to Splits!</Text>

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

      <View>
        <Text style={tailwind("text-center p-8 ")}>
          or login with social account
        </Text>
      </View>

      <TouchableOpacity style={tailwind("items-center")}>
        <View
          style={tailwind(
            "flex-row items-center px-10 py-3 rounded-lg bg-blue-700 items-center font-bold py-3.5 w-52"
          )}
        >
          <Svg
            viewBox="0 0 30 30"
            fill="currentColor"
            style={tailwind("h-8 w-8 text-white mr-3")}
          >
            <Path d="M15 3C8.373 3 3 8.373 3 15s5.373 12 12 12 12-5.373 12-12S21.627 3 15 3zm4.181 8h-1.729C16.376 11 16 11.568 16 12.718V14h3.154l-.428 3H16v7.95a10.057 10.057 0 0 1-3-.151V17h-3v-3h3v-1.611C13 9.339 14.486 8 17.021 8c1.214 0 1.856.09 2.16.131V11z" />
          </Svg>
          <Text style={tailwind("text-white font-semibold text-lg")}>
            Facebook
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
