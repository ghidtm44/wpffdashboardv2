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
    const { data } = await supabase
      .from('team_standings')
      .select('*')
      .order('wins', { ascending: false });
    if (data) set({ teams: data });
  },
  
  fetchResults: async () => {
    const { data } = await supabase
      .from('weekly_results')
      .select('*')
      .order('week', { ascending: true });
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
    const { error } = await supabase
      .from('teams')
      .insert([{ name, manager }]);
      
    if (error) throw error;
    await get().fetchTeams();
  },
  
  addResult: async (result) => {
    const { error } = await supabase
      .from('weekly_results')
      .upsert([result], {
        onConflict: 'team_id,opponent_id,week'
      });
      
    if (error) throw error;
    await get().fetchResults();
    await get().fetchTeams();
  },
  
  addWriteup: async (week, content) => {
    const { error } = await supabase
      .from('weekly_writeups')
      .insert([{ week, content }]);
      
    if (error) throw error;
    await get().fetchWriteup();
  },
}));
