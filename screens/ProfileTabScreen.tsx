import React from "react";

import { Button, Icon, ScrollView, Spinner } from "native-base";

import { useStore } from "state/userState";
import { RootStackParamList, RootTabScreenProps } from "types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import UserProfile from "components/UserProfile";
import { SafeAreaView } from "react-native-safe-area-context";

import { showMessage } from "react-native-flash-message";
import { supabase } from "lib/supabase";
import { Path } from "react-native-svg";
import { useUserStats } from "model/user";

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
    <SafeAreaView style={{ flex: 1 }}>
      <Button
        position={"absolute"}
        right={8}
        bottom={0}
        marginBottom={32}
        rounded={16}
        alignSelf={"flex-end"}
        variant={"primary"}
        h={10}
        w={10}
        onPress={() => supabase.auth.signOut()}
      >
        <Icon viewBox="0 0 20 20" fill="black">
          <Path
            fillRule="evenodd"
            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
            clipRule="evenodd"
          />
        </Icon>
      </Button>

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
