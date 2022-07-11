import React, { useEffect, useState } from "react";

import { ScrollView, Spinner } from "native-base";

import { useStore } from "state/userState";
import { RootStackParamList, RootTabScreenProps } from "types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import UserProfile from "components/UserProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "lib/supabase";
import { useUser, useUserStats } from "model/User";
import { showMessage } from "react-native-flash-message";

export default function ProfileTabScreens({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Profile">) {
  const { user } = useStore();

  if (!user) {
    showMessage({
      message: "Unexpected error, please try restarting the application",
      type: "danger",
    });

    navigation.goBack();
    return null;
  }

  const { data: userStats, isLoading } = useUserStats({ userId: user.id });

  if (isLoading || !userStats) return <Spinner size={"lg"} mt={3} />;
  return (
    <SafeAreaView>
      <ScrollView>
        <UserProfile
          user={user}
          stats={userStats}
          settingsButton={true}
          onSettingsPress={() => {
            navigation.navigate("Settings");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
