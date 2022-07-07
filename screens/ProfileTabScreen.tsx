import React from "react";

import { ScrollView } from "native-base";

import { useStore } from "state/userState";
import { RootStackParamList, RootTabScreenProps } from "types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import UserProfile from "components/UserProfile";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileTabScreens({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Profile">) {
  const { user } = useStore();

  if (!user) return;

  return (
    <SafeAreaView>
      <ScrollView>
        <UserProfile
          user={user}
          settingsButton={true}
          onSettingsPress={() => {
            navigation.navigate("Settings");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
