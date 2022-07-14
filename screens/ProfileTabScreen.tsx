import React from "react";

import { Button, Icon, ScrollView, Spinner } from "native-base";

import { useStore } from "state/userState";
import { RootStackParamList, RootTabScreenProps } from "types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import UserProfile from "components/UserProfile";
import { SafeAreaView } from "react-native-safe-area-context";

import { showMessage } from "react-native-flash-message";
import { useUserStats } from "model/User";
import { supabase } from "lib/supabase";
import { Path } from "react-native-svg";

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
      <Button
        marginRight={"6"}
        marginTop={"96"}
        alignSelf={"flex-end"}
        h={10}
        w={10}
        variant={"primary"}
        size={"sm"}
        onPress={() => supabase.auth.signOut()}
      >
        <Icon viewBox="0 0 24 24" fill="none" stroke-width="6">
          <Path
            stroke="black"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </Icon>
      </Button>
    </SafeAreaView>
  );
}
