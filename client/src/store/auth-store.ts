import { create } from 'zustand';
import { getDeviceId, getUserIP } from '@/lib/fingerprint';
import { anonymousLogin, createUserProfile, getSession } from '@/lib/supabase';

interface User {
  id: string;
  anonymous: boolean;
  deviceId: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  
  initialize: async () => {
    if (get().initialized) return;
    
    try {
      // Check for existing session
      const { session } = await getSession();
      
      if (session) {
        set({
          user: {
            id: session.user.id,
            anonymous: true,
            deviceId: session.user.user_metadata.device_id || 'unknown'
          },
          loading: false,
          initialized: true
        });
        return;
      }

      // No session exists, proceed with anonymous login
      const deviceId = await getDeviceId();
      const ipAddress = await getUserIP();
      
      const { data, error } = await anonymousLogin(deviceId);
      
      if (error) {
        throw error;
      }

      if (data?.user) {
        // Create or update user profile with device ID and IP
        await createUserProfile(data.user.id, deviceId, ipAddress);
        
        set({
          user: {
            id: data.user.id,
            anonymous: true,
            deviceId
          },
          loading: false,
          initialized: true
        });
      }
    } catch (err) {
      console.error('Authentication initialization error:', err);
      set({ loading: false, initialized: true });
    }
  }
}));
