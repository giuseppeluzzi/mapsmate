import React from "react";
import UserProfile from "components/UserProfile";
import { Box, ScrollView, Spinner } from "native-base";

import { supabase } from "lib/supabase";
import { showMessage } from "react-native-flash-message";
import { useQuery, useQueryClient } from "react-query";
import { RootStackScreenProps } from "types";
import { useStore } from "state/userState";
import { useEffect } from "react";
import { useUser, useUserStats } from "model/user";

const useUserIsFollowing = ({
  userId,
  followedId,
}: {
  userId: string;
  followedId: string;
}) => {
  return useQuery<boolean>(
    ["userIsFollowing", userId, followedId],
    async () => {
      const { data, error } = await supabase
        .from("follows")
        .select()
        .eq("user_id", userId)
        .eq("followed_user_id", followedId);

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) return false;

      return true;
    }
  );
};

export default function UserScreen({
  navigation,
  route,
}: RootStackScreenProps<"User">) {
  const queryClient = useQueryClient();
  const { user } = useStore();

  if (!user) {
    showMessage({
      message: "Unexpected error, please try restarting the application",
      type: "danger",
    });

    navigation.goBack();
    return null;
  }

  const { data: userData, isLoading } = useUser({
    userId: route.params.userId,
  });

  const { data: statsData, isLoading: isLoadingStats } = useUserStats({
    userId: route.params.userId,
  });

  const { data: followingData, isSuccess: isLoadingFollowingData } =
    useUserIsFollowing({
      userId: user.id,
      followedId: route.params.userId,
    });

  useEffect(() => {
    if (userData && userData.username) {
      navigation.setOptions({
        title: "@" + userData.username,
      });
    }
  }, [userData]);

  if (isLoading || !userData) return <Spinner size={"lg"} mt={3} />;

  if (!userData || userData.id == user.id) {
    showMessage({
      message: "User not found",
      type: "danger",
    });

    navigation.goBack();
    return null;
  }

  if (isLoadingStats || !statsData) return <Spinner size={"lg"} mt={3} />;

  const invalidateQueries = () => {
    queryClient.invalidateQueries(["user", userData.id], {
      refetchActive: true,
      refetchInactive: true,
    });
    queryClient.invalidateQueries(["userStats", userData.id], {
      refetchActive: true,
      refetchInactive: true,
    });
    queryClient.invalidateQueries(["userIsFollowing", user.id, userData.id], {
      refetchActive: true,
      refetchInactive: true,
    });
    queryClient.invalidateQueries(["userMapPins", user.id], {
      refetchActive: true,
      refetchInactive: true,
    });
  };

  const followUser = async () => {
    await supabase.from("follows").insert([
      {
        user_id: user.id,
        followed_user_id: userData.id,
      },
    ]);

    invalidateQueries();
  };

  const unfollowUser = async () => {
    await supabase.from("follows").delete().match({
      user_id: user.id,
      followed_user_id: userData.id,
    });

    invalidateQueries();
  };

  return (
    <>
      <Box>
        <ScrollView>
          <Box>
            <UserProfile
              user={userData}
              stats={statsData}
              followButton={isLoadingFollowingData && !followingData}
              unfollowButton={isLoadingFollowingData && followingData}
              onFollowPress={followUser}
              onUnfollowPress={unfollowUser}
            />
          </Box>
        </ScrollView>
      </Box>
    </>
  );
}
