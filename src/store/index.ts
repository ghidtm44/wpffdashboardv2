import { create } from 'zustand';
import { Team, WeeklyResult, WeeklyWriteup } from '../types';
import { supabase } from '../lib/supabase';

interface AppState {
  teams: Team[];
  results: WeeklyResult[];
  writeup: WeeklyWriteup | null;
  isCommissioner: boolean;
  setCommissioner: (value: boolean) => void;
  fetchTeams: () => Promise<void>;
  fetchResults: () => Promise<void>;
  fetchWriteup: () => Promise<void>;
  addTeam: (name: string, manager: string) => Promise<void>;
  addResult: (result: Omit<WeeklyResult, 'id'>) => Promise<void>;
  addWriteup: (week: number, content: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  teams: [],
  results: [],
  writeup: null,
  isCommissioner: false,
  
  setCommissioner: (value) => set({ isCommissioner: value }),
  
  fetchTeams: async () => {
    const { data } = await supabase.from('teams').select('*');
    if (data) set({ teams: data });
  },
  
  fetchResults: async () => {
    const { data } = await supabase.from('weekly_results').select('*');
    if (data) set({ results: data });
  },
  
  fetchWriteup: async () => {
    const { data } = await supabase
      .from('weekly_writeups')
      .select('*')
      .order('week', { ascending: false })
      .limit(1)
      .single();
    if (data) set({ writeup: data });
  },
  
  addTeam: async (name, manager) => {
    const { data, error } = await supabase
      .from('teams')
      .insert([{ name, manager }])
      .select()
      .single();
      
    if (data && !error) {
      const { teams } = get();
      set({ teams: [...teams, data] });
    }
  },
  
  addResult: async (result) => {
    const { data, error } = await supabase
      .from('weekly_results')
      .insert([result])
      .select()
      .single();
      
    if (data && !error) {
      const { results } = get();
      set({ results: [...results, data] });
    }
  },
  
  addWriteup: async (week, content) => {
    const { data, error } = await supabase
      .from('weekly_writeups')
      .insert([{ week, content }])
      .select()
      .single();
      
    if (data && !error) {
      set({ writeup: data });
    }
  },
}));