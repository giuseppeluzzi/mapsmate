import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import tailwind from "tailwind-rn";
import { Text } from "../components/Themed";
import { supabase } from "../lib/supabase";
import { RootStackParamList } from "../types";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeScreen({
  navigation
}: NativeStackScreenProps<RootStackParamList, "Welcome">) {
  const [loading, setLoading] = useState<boolean>(false);

  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <SafeAreaView style={tailwind("bg-gray-100 pt-6")}>
      <View style={tailwind("px-8")}>
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
            editable={!loading}
            keyboardType={"email-address"}
            autoCapitalize={"none"}
            autoCompleteType={"email"}
            placeholder="Enter your email address"
            value={mail}
            onChangeText={text => setMail(text)}
          />
        </View>
        <View style={tailwind("pt-6")}>
          <Text style={tailwind("uppercase font-medium text-sm")}>
            Password
          </Text>
          <TextInput
            style={tailwind(
              "mt-2 py-4 px-6 font-medium text-black bg-white rounded-lg"
            )}
            secureTextEntry={true}
            editable={!loading}
            placeholder="Enter your password"
            value={password}
            onChangeText={text => setPassword(text)}
          />
        </View>
      </View>
      <TouchableOpacity
        disabled={loading}
        style={tailwind("self-end w-3/4 pt-10")}
        onPress={async () => {
          if (mail.trim().length === 0 || password.trim().length === 0) {
            showMessage({
              message: "Insert username and password",
              type: "danger"
            });
            return;
          }

          setLoading(true);
          const { user, session, error } = await supabase.auth.signIn({
            email: mail,
            password: password
          });
          setLoading(false);

          if (error) {
            showMessage({
              message: error.message,
              type: "danger"
            });
          }

          if (session && session.refresh_token) {
            AsyncStorage.setItem("auth/refresh_token", session.refresh_token);
          }
        }}
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
        <Text style={tailwind("text-center pt-8 pb-6")}>
          or login with your social account
        </Text>
      </View>

      <TouchableOpacity style={tailwind("items-center")}>
        <View
          style={tailwind(
            "flex-row items-center px-10 py-3 rounded-lg bg-blue-700 items-center font-bold w-52"
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
