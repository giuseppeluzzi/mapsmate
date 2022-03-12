import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://qfjavyudshdwnuoedalk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmamF2eXVkc2hkd251b2VkYWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDcwNDYyMTIsImV4cCI6MTk2MjYyMjIxMn0.aucOMjT4hH3eUTHHClEWTkJWkKrLvAhGEVLk1OzpsFk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false
});
