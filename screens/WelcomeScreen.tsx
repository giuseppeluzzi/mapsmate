import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Heading, VStack } from "native-base";
import { RootStackParamList } from "../types";

export default function WelcomeScreen({
  navigation
}: NativeStackScreenProps<RootStackParamList, "Welcome">) {
  return (
    <VStack
      height={"full"}
      alignItems={"center"}
      justifyContent={"center"}
      space={4}
    >
      <Heading size={"2xl"} mb={3}>
        Welcome to Splits!
      </Heading>
      <Button
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        LOGIN
      </Button>
      <Button
        onPress={() => {
          navigation.navigate("SignUp");
        }}
      >
        SIGN UP
      </Button>
    </VStack>
  );
}
