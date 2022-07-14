import { supabase } from "lib/supabase";
import { useQuery } from "react-query";
import { User, UserStats } from "types";

export const useUser = ({ userId }: { userId: string }) => {
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
      biography: data[0].biography,
    };
  });
};

export const useUserStats = ({ userId }: { userId: string }) => {
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
