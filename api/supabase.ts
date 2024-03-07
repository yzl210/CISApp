import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = "https://qszbybvxirdfhekngzbj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzemJ5YnZ4aXJkZmhla25nemJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkzMzIxODIsImV4cCI6MjAyNDkwODE4Mn0.rivTg17wqzZ6Zd-Z6va_iNpkZPDdDrd3bPkfm3pwENo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export function isLoggedIn() {
    return supabase.auth.getSession() !== null;
}

