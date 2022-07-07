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

<<<<<<< Updated upstream
  if (!user) return;
=======
  const [username, setUsername] = useState<string>();
  const [userEmoji, setUserEmoji] = useState<string>();

  useEffect(() => {
    supabase
      .from("profiles")
      .select("name, emoji")
      .eq("id", user?.id)
      .then((result) => {
        if (!result.data || !result.data[0]) return;
        setUsername(result.data[0].name);
        setUserEmoji(result.data[0].emoji);
      });
  }, []);
>>>>>>> Stashed changes

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
