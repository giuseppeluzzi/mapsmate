import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, HStack, Input, ScrollView, Text, VStack } from "native-base";
import * as React from "react";
import { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import tailwind from "tailwind-rn";
import {
  initializeUserProfile,
  loadUserProfile,
  onFacebookLogin,
  supabase,
} from "../lib/supabase";
import { useStore } from "../state/userState";
import { RootStackParamList } from "../types";

export default function WelcomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Welcome">) {
  const { setUser } = useStore();

  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const signup = async () => {
    if (
      mail.trim().length === 0 ||
      password.trim().length === 0 ||
      passwordConfirm.trim().length === 0
    ) {
      showMessage({
        message: "Insert username and password",
        type: "danger",
      });
      return;
    }

    if (password !== passwordConfirm) {
      showMessage({
        message: "Passwords do not match",
        type: "danger",
      });
      return;
    }

    setLoading(true);
    const { user, error } = await supabase.auth.signUp({
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
      await initializeUserProfile(user.id, name, username, mail);
      loadUserProfile(user.id).then((user) => {
        setUser(user);
      });
      return;
    }

    showMessage({
      message: "Unexpected error, please try again",
      type: "danger",
    });
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <VStack space={8} px={6} pt={6}>
          <Button
            alignSelf={"flex-end"}
            variant={"ghost"}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text>Login</Text>
          </Button>

          <VStack space={2}>
            <Text fontWeight={"black"} fontSize={"5xl"}>
              Signup
            </Text>
            <Text fontSize={"md"}>
              Welcome to{" "}
              <Text color={"primary.500"} bold>
                mapsmate
              </Text>
              !
            </Text>
          </VStack>

          <VStack space={2}>
            <Text>Name</Text>
            <Input
              py={3}
              editable={!loading}
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </VStack>

          <VStack space={2}>
            <Text>Username</Text>
            <Input
              py={3}
              editable={!loading}
              autoCapitalize={"none"}
              autoComplete={"off"}
              placeholder="Enter your username"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
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
              placeholder="Enter your password"
              editable={!loading}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </VStack>
          {/* temp workaround for ios */}
          {/*<TextInput style={{ height: 0.01 }} /> */}

          <VStack space={2}>
            <Text>Repeat password</Text>
            <Input
              py={3}
              secureTextEntry={true}
              placeholder="Repeat your password"
              editable={!loading}
              value={passwordConfirm}
              onChangeText={(text) => setPasswordConfirm(text)}
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
            onPress={signup}
          >
            Join mapsmate!
          </Button>

          <VStack space={3}>
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
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
