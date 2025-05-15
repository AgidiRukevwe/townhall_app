import { useEffect, useState } from 'react';
import { getDeviceId, getUserIP } from '@/lib/fingerprint';
import { anonymousLogin, createUserProfile, getSession, supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';

export function useAuth() {
  const { user, setUser, setLoading, loading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Initialize authentication on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing session
        const { session, error: sessionError } = await getSession();
        
        if (sessionError) {
          throw new Error(sessionError.message);
        }

        if (session) {
          setUser({
            id: session.user.id,
            anonymous: true,
            deviceId: session.user.user_metadata.device_id || 'unknown'
          });
          return;
        }

        // No session exists, proceed with anonymous login
        const deviceId = await getDeviceId();
        const ipAddress = await getUserIP();
        
        const { data, error: loginError } = await anonymousLogin(deviceId);
        
        if (loginError) {
          throw new Error(loginError.message);
        }

        if (data.user) {
          // Create or update user profile with device ID and IP
          await createUserProfile(data.user.id, deviceId, ipAddress);
          
          setUser({
            id: data.user.id,
            anonymous: true,
            deviceId
          });
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Unknown authentication error');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser({
            id: session.user.id,
            anonymous: true,
            deviceId: session.user.user_metadata.device_id || 'unknown'
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return { user, loading, error };
}
