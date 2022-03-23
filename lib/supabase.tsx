import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri, startAsync } from "expo-auth-session";
import { showMessage } from "react-native-flash-message";

const supabaseUrl = "https://qfjavyudshdwnuoedalk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmamF2eXVkc2hkd251b2VkYWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDcwNDYyMTIsImV4cCI6MTk2MjYyMjIxMn0.aucOMjT4hH3eUTHHClEWTkJWkKrLvAhGEVLk1OzpsFk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false
});

export const onFacebookLogin = () => {
  const proxyRedirectUri = makeRedirectUri({
    useProxy: true
  });
  const redirectUri = makeRedirectUri({
    path: "/",
    useProxy: false
  });

  startAsync({
    authUrl:
      "https://qfjavyudshdwnuoedalk.supabase.co/auth/v1/authorize?provider=facebook&redirect_to=" +
      proxyRedirectUri,
    returnUrl: redirectUri
  }).then(async result => {
    if (!result) return;

    if (result.type === "error" && result.error) {
      showMessage({
        message: result.error?.message,
        type: "danger"
      });

      return;
    }

    if (result.type === "success" && result.params) {
      const { session, error } = await supabase.auth.signIn({
        refreshToken: result.params.refresh_token
      });

      if (error) {
        showMessage({
          message: "Unexpected error, please try again",
          type: "danger"
        });
      }

      if (session && session.refresh_token) {
        AsyncStorage.setItem("auth/refresh_token", session.refresh_token);
      }
    } else {
      showMessage({
        message: "Unexpected error, please try again",
        type: "danger"
      });
    }
  });
};

export const initializeUserProfile = (id: string, name: string) => {
  const emojis = [
    "🤪",
    "😃",
    "😈",
    "💩",
    "🐷",
    "🐥",
    "🐙",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "❤️‍🔥",
    "🥐",
    "🍓"
  ];

  supabase
    .from("profiles")
    .select("id")
    .eq("id", id)
    .then(value => {
      if (!value.data || value.data.length === 0) {
        supabase.from("profiles").insert([
          {
            id: id,
            name: name,
            emoji: emojis[Math.floor(Math.random() * (emojis.length + 1))]
          }
        ]);
      }
    });
};
