import * as React from "react";
import UserProfile from "components/UserProfile";
import { Box, ScrollView, Spinner } from "native-base";

import { supabase } from "lib/supabase";
import { showMessage } from "react-native-flash-message";
import { useQuery, useQueryClient } from "react-query";
import { RootStackScreenProps, User, UserStats } from "types";
import { useStore } from "state/userState";
import { useEffect } from "react";

const useUser = ({ userId }: { userId: string }) => {
  return useQuery<User | null>(["user", userId], async () => {
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

const useUserStats = ({ userId }: { userId: string }) => {
  return useQuery<UserStats>(["userStats", userId], async () => {
    const responses = await Promise.all([
      supabase
        .from("reviews")
        .select("id", { count: "exact" })
        .eq("user_id", userId),
      supabase
        .from("follows")
        .select("id", { count: "exact" })
        .eq("followed_user_id", userId),
      supabase
        .from("follows")
        .select("id", { count: "exact" })
        .eq("user_id", userId),
    ]);

    if (responses[0].error) new Error(responses[0].error.message);
    if (responses[1].error) new Error(responses[1].error.message);
    if (responses[2].error) new Error(responses[2].error.message);

    return {
      reviewsCount: responses[0]?.count ?? 0,
      followersCount: responses[1]?.count ?? 0,
      followingCount: responses[2]?.count ?? 0,
    };
  });
};

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
    statsData != undefined && (
      <>
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
      </>
    )
  );
}
