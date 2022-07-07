import UserProfile from "components/UserProfile";
import { supabase } from "lib/supabase";
import { Box, ScrollView, Spinner } from "native-base";
import * as React from "react";
import { useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import { useQuery } from "react-query";
import { RootStackScreenProps, User } from "types";

const useUser = ({ userId }: { userId: string }) => {
  return useQuery<User | null>("user", async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return null;
    }

    return {
      id: data[0].id,
      name: data[0].name,
      username: data[0].username,
      email: data[0].email,
      emoji: data[0].emoji,
    };
  });
};

export default function UserScreen({
  navigation,
  route,
}: RootStackScreenProps<"User">) {
  const { data, isLoading } = useUser({ userId: route.params.userId });

  if (isLoading) return <Spinner size={"lg"} mt={3} />;

  if (!data) {
    showMessage({
      message: "User not found",
      type: "danger",
    });
    return;
  }

  navigation.setOptions({
    title: data.username ? "@" + data.username : "",
  });

  return (
    <ScrollView>
      <Box>
        <UserProfile user={data} />
      </Box>
    </ScrollView>
  );
}
