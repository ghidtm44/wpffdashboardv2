import { createClient } from '@supabase/supabase-js';
import YahooFantasy from 'yahoo-fantasy';

// Use process.env for server-side environment variables
const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID;
const YAHOO_CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET;
const LEAGUE_KEY = process.env.YAHOO_LEAGUE_KEY;
const CALLBACK_URL = process.env.URL + '/auth/callback';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);
const yf = new YahooFantasy(YAHOO_CLIENT_ID!, YAHOO_CLIENT_SECRET!, CALLBACK_URL);

export async function syncYahooData() {
  try {
    // Get stored tokens
    const { data: tokens } = await supabase
      .from('yahoo_tokens')
      .select('*')
      .eq('id', 'current')
      .single();

    if (!tokens) {
      throw new Error('No stored tokens found');
    }

    // Set the tokens
    yf.auth.setTokens({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });

    // Get league data
    const league = await yf.league.get(LEAGUE_KEY!);
    const teams = await yf.league.teams(LEAGUE_KEY!);
    const scoreboard = await yf.league.scoreboard(LEAGUE_KEY!);

    // Update teams
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
      const [team1, team2] = matchup.teams;

      await supabase.from('weekly_results').upsert([
        {
          team_id: team1.team_id,
          opponent_id: team2.team_id,
          week,
          points: team1.points,
          opponent_points: team2.points,
          top_player: false,
          top_points: false
        },
        {
          team_id: team2.team_id,
          opponent_id: team1.team_id,
          week,
          points: team2.points,
          opponent_points: team1.points,
          top_player: false,
          top_points: false
        }
      ]);
    }

    return { success: true };
  } catch (error) {
    console.error('Error syncing Yahoo data:', error);
    return { success: false, error: error.message };
  }
}
