import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Supabase 대시보드 -> Settings -> API 에서 확인 가능
const supabaseUrl = 'https://jzchrzorkmkfxvixctdw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6Y2hyem9ya21rZnh2aXhjdGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNzA0MzAsImV4cCI6MjA3NTg0NjQzMH0.inYXLyVONGuxTHeNT-lIQ0b-HzEI6ccu4LG1mH6aemA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});