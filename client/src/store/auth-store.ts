import { create } from "zustand";
import { getDeviceId, getUserIP } from "@/lib/fingerprint";
import { anonymousLogin, createUserProfile, getSession } from "@/lib/supabase";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  anonymous: boolean;
  deviceId: string;
  email?: string;
  avatar_url?: string;
  username: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      initialized: false,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),

      initialize: async () => {
        if (get().initialized) return;

        try {
          const { session } = await getSession();

          if (session) {
            const supaUser = session.user;
            const provider = supaUser.app_metadata?.provider;

            // If it's Google login
            if (provider === "google") {
              const deviceId = supaUser.user_metadata?.device_id ?? "google";

              set({
                user: {
                  id: supaUser.id,
                  anonymous: false,
                  deviceId,
                  email: supaUser.email ?? "",
                  username: supaUser.user_metadata.full_name,
                  avatar_url: supaUser.user_metadata.picture,
                },
                loading: false,
                initialized: true,
              });

              return;
            }

            // Else, treat as anonymous
            set({
              user: {
                id: supaUser.id,
                anonymous: true,
                deviceId: supaUser.user_metadata.device_id || "unknown",
                email: supaUser.email ?? "",
                username: supaUser.user_metadata.full_name,
                avatar_url: supaUser.user_metadata.picture,
              },
              loading: false,
              initialized: true,
            });

            return;
          }

          // No session — do anonymous login
          const deviceId = await getDeviceId();
          const ipAddress = await getUserIP();

          const { data, error } = await anonymousLogin(deviceId);
          if (error) throw error;

          if (data?.user) {
            await createUserProfile(data.user.id, deviceId, ipAddress);

            set({
              user: {
                id: data.user.id,
                anonymous: true,
                deviceId,
                username: "Guest",
                avatar_url: data.user.user_metadata.picture,
              },
              loading: false,
              initialized: true,
            });
          }
        } catch (err) {
          console.error("Auth init error:", err);
          set({ loading: false, initialized: true });
        }
      },
    }),
    {
      name: "auth-storage", // Key name in localStorage
      partialize: (state) => ({
        user: state.user,
        initialized: state.initialized,
      }),
    }
  )
);
