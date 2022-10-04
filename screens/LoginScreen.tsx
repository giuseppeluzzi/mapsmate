import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import tailwind from "tailwind-rn";
import { loadUserProfile, onFacebookLogin, supabase } from "../lib/supabase";
import { RootStackParamList } from "../types";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "state/userState";
import {
  Button,
  HStack,
  Input,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";

export default function WelcomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Welcome">) {
  const { setUser } = useStore();

  const [loading, setLoading] = useState<boolean>(false);

  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = async () => {
    if (mail.trim().length === 0 || password.trim().length === 0) {
      showMessage({
        message: "Insert username and password",
        type: "danger",
      });
      return;
    }

    setLoading(true);
    const { user, session, error } = await supabase.auth.signIn({
      email: mail,
      password: password,
    });

    if (error) {
      setLoading(false);
      showMessage({
        message: error.message,
        type: "danger",
      });
      return;
    }

    if (user) {
      loadUserProfile(user.id).then((user) => {
        setUser(user);
      });
    }

    if (session && session.refresh_token) {
      AsyncStorage.setItem("auth/refresh_token", session.refresh_token);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <VStack space={8} px={6} pt={6}>
          <Button
            alignSelf={"flex-end"}
            variant={"ghost"}
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text>Signup</Text>
          </Button>
          <VStack space={2}>
            <Text fontWeight={"black"} fontSize={"5xl"}>
              Login
            </Text>
            <Text fontSize={"md"}>
              Welcome back to{" "}
              <Text color={"primary.500"} bold>
                mapsmate
              </Text>
              !
            </Text>
          </VStack>
          <VStack space={2}>
            <Text>Email</Text>
            <Input
              py={3}
              editable={!loading}
              keyboardType={"email-address"}
              autoCapitalize={"none"}
              autoComplete={"email"}
              placeholder="Enter your email address"
              value={mail}
              onChangeText={(text) => setMail(text)}
            />
          </VStack>
          <VStack space={2}>
            <Text>Password</Text>
            <Input
              py={3}
              secureTextEntry={true}
              editable={!loading}
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </VStack>
          <Button
            mt={4}
            mb={6}
            alignSelf={"flex-end"}
            py={3}
            mr={-8}
            w={"3/4"}
            rounded={16}
            borderTopRightRadius={0}
            borderBottomRightRadius={0}
            _text={{
              fontSize: "lg",
            }}
            onPress={login}
          >
            Login
          </Button>

          {/* <VStack space={3}>
            <Text textAlign={"center"}>or login with your social account</Text>

            <Button
              bg={"blue.700"}
              alignSelf={"center"}
              px={12}
              py={3}
              rounded={16}
              onPress={onFacebookLogin}
            >
              <HStack space={3} alignItems={"center"}>
                <Svg
                  viewBox="0 0 30 30"
                  fill="currentColor"
                  style={tailwind("h-8 w-8 text-white mr-3")}
                >
                  <Path d="M15 3C8.373 3 3 8.373 3 15s5.373 12 12 12 12-5.373 12-12S21.627 3 15 3zm4.181 8h-1.729C16.376 11 16 11.568 16 12.718V14h3.154l-.428 3H16v7.95a10.057 10.057 0 0 1-3-.151V17h-3v-3h3v-1.611C13 9.339 14.486 8 17.021 8c1.214 0 1.856.09 2.16.131V11z" />
                </Svg>
                <Text fontSize={"lg"} color={"white"}>
                  Facebook
                </Text>
              </HStack>
            </Button>
          </VStack> */}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
