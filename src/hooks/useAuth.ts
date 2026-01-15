import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Prayer } from '@/types/prayer';
import { Json } from '@/integrations/supabase/types';

interface Profile {
  id: string;
  user_id: string;
  prayer_schedule: Prayer[];
  subscription_status: 'free' | 'premium' | 'trial';
  created_at: string;
  updated_at: string;
}

const parseSubscriptionStatus = (status: string): 'free' | 'premium' | 'trial' => {
  if (status === 'premium' || status === 'trial') return status;
  return 'free';
};

const parsePrayerSchedule = (schedule: Json): Prayer[] => {
  if (!Array.isArray(schedule)) return [];
  return schedule.map((item) => {
    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      const record = item as Record<string, unknown>;
      return {
        id: String(record.id || ''),
        name: String(record.name || ''),
        arabicName: String(record.arabicName || ''),
        time: String(record.time || '00:00'),
        silenceEnabled: Boolean(record.silenceEnabled),
        silenceDuration: Number(record.silenceDuration) || 15,
        reminderEnabled: record.reminderEnabled !== undefined ? Boolean(record.reminderEnabled) : true,
        reminderMinutes: Number(record.reminderMinutes) || 10,
      } as Prayer;
    }
    return null;
  }).filter((item): item is Prayer => item !== null);
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (data) {
        const profileData: Profile = {
          id: data.id,
          user_id: data.user_id,
          prayer_schedule: parsePrayerSchedule(data.prayer_schedule),
          subscription_status: parseSubscriptionStatus(data.subscription_status),
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        setProfile(profileData);
        return profileData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to avoid potential race conditions
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { data, error };
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
    return { error };
  };

  // Reset password
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  };

  // Update prayer schedule in profile
  const updatePrayerSchedule = async (prayers: Prayer[]) => {
    if (!user) return { error: new Error('Not authenticated') };

    const prayerData = prayers.map(p => ({
      id: p.id,
      name: p.name,
      arabicName: p.arabicName,
      time: p.time,
      silenceEnabled: p.silenceEnabled,
      silenceDuration: p.silenceDuration,
      reminderEnabled: p.reminderEnabled,
      reminderMinutes: p.reminderMinutes,
    }));

    const { data, error } = await supabase
      .from('profiles')
      .update({ prayer_schedule: prayerData })
      .eq('user_id', user.id)
      .select()
      .single();

    if (data && !error) {
      setProfile(prev => prev ? { ...prev, prayer_schedule: prayers } : null);
    }

    return { data, error };
  };

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updatePrayerSchedule,
    fetchProfile,
  };
};
