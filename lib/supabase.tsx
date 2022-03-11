import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://erdemqkplhonojqkvwqs.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZGVtcWtwbGhvbm9qcWt2d3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY3NTY3NDgsImV4cCI6MTk2MjMzMjc0OH0.-_jQoQ4Ss9T4Vlc14F-QpiyiaWtNlBiHXdv9LdsV2mY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)