import { create } from 'zustand';
import { Team, WeeklyResult, WeeklyWriteup } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

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
    try {
      const { data, error } = await supabase
        .from('team_standings')
        .select('*')
        .order('wins', { ascending: false });
        
      if (error) throw error;
      if (data) set({ teams: data });
    } catch (error) {
      toast.error('Failed to fetch teams');
      console.error('Error fetching teams:', error);
    }
  },
  
  fetchResults: async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_results')
        .select('*')
        .order('week', { ascending: true });
        
      if (error) throw error;
      if (data) set({ results: data });
    } catch (error) {
      toast.error('Failed to fetch results');
      console.error('Error fetching results:', error);
    }
  },
  
  fetchWriteup: async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_writeups')
        .select('*')
        .order('week', { ascending: false })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      if (data) set({ writeup: data });
    } catch (error) {
      toast.error('Failed to fetch writeup');
      console.error('Error fetching writeup:', error);
    }
  },
  
  addTeam: async (name, manager) => {
    try {
      const { error } = await supabase
        .from('teams')
        .insert([{ name, manager }]);
        
      if (error) throw error;
      
      toast.success('Team added successfully!');
      await get().fetchTeams();
    } catch (error) {
      toast.error('Failed to add team');
      console.error('Error adding team:', error);
      throw error;
    }
  },
  
  addResult: async (result) => {
    try {
      const { error } = await supabase
        .from('weekly_results')
        .upsert([result], {
          onConflict: 'team_id,opponent_id,week'
        });
        
      if (error) throw error;
      
      await get().fetchResults();
      await get().fetchTeams();
    } catch (error) {
      toast.error('Failed to add result');
      console.error('Error adding result:', error);
      throw error;
    }
  },
  
  addWriteup: async (week, content) => {
    try {
      const { error } = await supabase
        .from('weekly_writeups')
        .insert([{ week, content }]);
        
      if (error) throw error;
      
      await get().fetchWriteup();
    } catch (error) {
      toast.error('Failed to add writeup');
      console.error('Error adding writeup:', error);
      throw error;
    }
  },
}));
