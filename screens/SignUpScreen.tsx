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
import Svg, { Path, SvgUri, Use } from "react-native-svg";
import tailwind from "tailwind-rn";
import { SocialIcon } from 'react-native-elements'
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
              onPress={() => {navigation.navigate('Login'); }}>
            <Text style={tailwind("font-medium") }>Login</Text>
          </TouchableOpacity>
        </View>
      
        <Text style={tailwind("pt-16 font-medium text-4xl")}>Sign Up</Text>
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
          <Text style={tailwind("font-medium text-lg")}>Join Splits!</Text>
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
        <Text style={tailwind("text-center p-8 ")}>or sign up with social account</Text>
      </View>

      <TouchableOpacity style={tailwind("items-center px-10 py-3")}>
      <SocialIcon
        title='Facebook'
        button
        type='facebook'
        style={tailwind("items-center px-10 py-3 rounded-lg bg-blue-800 items-center font-bold py-3.5 w-3/4 text-white")}
      />
      </TouchableOpacity>
      
      <View>
        <Text style={tailwind("text-center p-8 -bottom-full")}>
          <Text>By clicking Join Splits, you are agreeing to the </Text>
          <Text style={tailwind("underline")}>Terms of Use</Text>
          <Text> and the </Text>
          <Text style={tailwind("underline")}>Privacy Policy</Text>
        </Text>
      </View>

    </SafeAreaView>
    
  );
}
