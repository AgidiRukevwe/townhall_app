import { createClient } from "@supabase/supabase-js";
import type { Database } from "@shared/schema";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

// const supabaseUrl = import.meta.env.SUPABASE_URL as string;
// const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string;

const supabaseUrl = SUPABASE_URL as string;
const supabaseAnonKey = SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function anonymousLogin(deviceId: string) {
  // Sign in anonymously by using device ID as an identifier
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${deviceId}@anonymous.townhall.ng`,
    password: deviceId,
  });

  if (error && error.message.includes("Invalid login credentials")) {
    // If the user doesn't exist, sign them up
    return signUpAnonymous(deviceId);
  }

  return { data, error };
}

async function signUpAnonymous(deviceId: string) {
  const { data, error } = await supabase.auth.signUp({
    email: `${deviceId}@anonymous.townhall.ng`,
    password: deviceId,
    options: {
      data: {
        anonymous: true,
        device_id: deviceId,
      },
    },
  });

  return { data, error };
}

export async function createUserProfile(
  userId: string,
  deviceId: string,
  ipAddress: string | null
) {
  const { data, error } = await supabase.from("user_profiles").upsert(
    {
      id: userId,
      device_id: deviceId,
      ip_address: ipAddress,
      created_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  return { data, error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}
