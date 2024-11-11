import YahooFantasy from 'yahoo-fantasy';
import { supabase } from './supabase';

const YAHOO_CLIENT_ID = import.meta.env.VITE_YAHOO_CLIENT_ID;
const YAHOO_CLIENT_SECRET = import.meta.env.VITE_YAHOO_CLIENT_SECRET;
const LEAGUE_KEY = import.meta.env.VITE_YAHOO_LEAGUE_KEY;
const CALLBACK_URL = import.meta.env.VITE_APP_URL + '/auth/callback';

const yf = new YahooFantasy(
  YAHOO_CLIENT_ID,
  YAHOO_CLIENT_SECRET,
  CALLBACK_URL
);

// Store tokens in Supabase for persistence
const storeTokens = async (tokens: { access_token: string; refresh_token: string }) => {
  try {
    await supabase
      .from('yahoo_tokens')
      .upsert({ 
        id: 'current',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        updated_at: new Date().toISOString()
      });
    return true;
  } catch (error) {
    console.error('Error storing tokens:', error);
    return false;
  }
};

// Retrieve tokens from Supabase
const getStoredTokens = async () => {
  try {
    const { data, error } = await supabase
      .from('yahoo_tokens')
      .select('*')
      .eq('id', 'current')
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return null;
  }
};

export const getAuthUrl = () => {
  return yf.auth.getAuthorizationUrl();
};

export const handleCallback = async (code: string) => {
  try {
    const tokens = await yf.auth.acquireAccessToken(code);
    await storeTokens(tokens);
    return { success: true };
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    return { success: false, error };
  }
};

export const syncYahooData = async () => {
  try {
    // Retrieve stored tokens
    const tokens = await getStoredTokens();
    if (!tokens) {
      throw new Error('No stored tokens found');
    }

    // Set the tokens in the Yahoo Fantasy client
    yf.auth.setTokens(tokens);

    if (!yf.auth.isAuthenticated()) {
      throw new Error('Not authenticated with Yahoo');
    }

    // Get league data
    const league = await yf.league.get(LEAGUE_KEY);
    
    // Get all teams
    const teams = await yf.league.teams(LEAGUE_KEY);
    
    // Get standings
    const standings = await yf.league.standings(LEAGUE_KEY);
    
    // Get scoreboard/matchups
    const scoreboard = await yf.league.scoreboard(LEAGUE_KEY);
    
    // Update teams in Supabase
    for (const team of teams) {
      await supabase
        .from('team_standings')
        .upsert({
          id: team.team_id,
          name: team.name,
          manager: team.manager.nickname,
          wins: team.standings.outcome_totals.wins,
          losses: team.standings.outcome_totals.losses
        });
    }
    
    // Update weekly results
    for (const matchup of scoreboard) {
      const week = matchup.week;
      const team1 = matchup.teams[0];
      const team2 = matchup.teams[1];
      
      // Add result for team 1
      await supabase
        .from('weekly_results')
        .upsert({
          team_id: team1.team_id,
          opponent_id: team2.team_id,
          week,
          points: team1.points,
          opponent_points: team2.points,
          top_player: false,
          top_points: false
        });
        
      // Add result for team 2
      await supabase
        .from('weekly_results')
        .upsert({
          team_id: team2.team_id,
          opponent_id: team1.team_id,
          week,
          points: team2.points,
          opponent_points: team1.points,
          top_player: false,
          top_points: false
        });
    }
    
    // Post-process to determine top scores for each week
    const results = await supabase
      .from('weekly_results')
      .select('*');
      
    if (results.data) {
      const weeklyTopScores = new Map();
      
      // Find top score for each week
      for (const result of results.data) {
        const currentTop = weeklyTopScores.get(result.week) || { points: 0 };
        if (result.points > currentTop.points) {
          weeklyTopScores.set(result.week, {
            team_id: result.team_id,
            points: result.points
          });
        }
      }
      
      // Update top_points flag
      for (const [week, topScore] of weeklyTopScores) {
        await supabase
          .from('weekly_results')
          .update({ top_points: true })
          .match({ week, team_id: topScore.team_id });
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error syncing Yahoo data:', error);
    return { success: false, error };
  }
};
