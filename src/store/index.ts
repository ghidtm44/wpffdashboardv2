import { create } from 'zustand';
import { Team, WeeklyResult, WeeklyWriteup, LeagueHistory } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AppState {
  teams: Team[];
  results: WeeklyResult[];
  writeup: WeeklyWriteup | null;
  history: LeagueHistory[];
  isCommissioner: boolean;
  setCommissioner: (value: boolean) => void;
  fetchTeams: () => Promise<void>;
  fetchResults: () => Promise<void>;
  fetchWriteup: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  addTeam: (name: string, manager: string) => Promise<void>;
  addResult: (result: Omit<WeeklyResult, 'id'>) => Promise<void>;
  addWriteup: (week: number, content: string) => Promise<void>;
  addLeagueWinner: (winner: Omit<LeagueHistory, 'id' | 'created_at'>) => Promise<void>;
  getTopScoringTeam: (week: number) => string | null;
}

export const useStore = create<AppState>((set, get) => ({
  teams: [],
  results: [],
  writeup: null,
  history: [],
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
      if (data) {
        // Process top scores for each week
        const weeklyResults = new Map<number, WeeklyResult[]>();
        data.forEach(result => {
          if (!weeklyResults.has(result.week)) {
            weeklyResults.set(result.week, []);
          }
          weeklyResults.get(result.week)!.push(result);
        });

        // Update top_points flag for each week's highest scorer
        const processedResults = data.map(result => {
          const weekResults = weeklyResults.get(result.week) || [];
          const maxPoints = Math.max(...weekResults.map(r => r.points));
          return {
            ...result,
            top_points: result.points === maxPoints
          };
        });

        set({ results: processedResults });
      }
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
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      if (data) set({ writeup: data });
    } catch (error) {
      toast.error('Failed to fetch writeup');
      console.error('Error fetching writeup:', error);
    }
  },

  fetchHistory: async () => {
    try {
      const { data, error } = await supabase
        .from('league_history')
        .select('*')
        .order('year', { ascending: false });
        
      if (error) throw error;
      if (data) set({ history: data });
    } catch (error) {
      toast.error('Failed to fetch league history');
      console.error('Error fetching history:', error);
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
      const { error: deleteError } = await supabase
        .from('weekly_results')
        .delete()
        .match({
          team_id: result.team_id,
          opponent_id: result.opponent_id,
          week: result.week
        });

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('weekly_results')
        .insert([result]);

      if (insertError) throw insertError;
      
      toast.success('Result added successfully!');
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
      
      toast.success('Write-up added successfully!');
      await get().fetchWriteup();
    } catch (error) {
      toast.error('Failed to add writeup');
      console.error('Error adding writeup:', error);
      throw error;
    }
  },

  addLeagueWinner: async (winner) => {
    try {
      const { error: deleteError } = await supabase
        .from('league_history')
        .delete()
        .match({ year: winner.year });

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('league_history')
        .insert([winner]);

      if (insertError) throw insertError;
      
      toast.success('League winner updated successfully!');
      await get().fetchHistory();
    } catch (error) {
      toast.error('Failed to update league winner');
      console.error('Error updating league winner:', error);
      throw error;
    }
  },

  getTopScoringTeam: (week: number) => {
    const results = get().results;
    if (!results.length) return null;

    const weekResults = results.filter(r => r.week === week);
    if (!weekResults.length) return null;

    const maxPoints = Math.max(...weekResults.map(r => r.points));
    const topTeam = weekResults.find(r => r.points === maxPoints);
    
    return topTeam ? topTeam.team_id : null;
  },
}));
