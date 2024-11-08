export interface Team {
  id: string;
  name: string;
  manager: string;
  wins?: number;
  losses?: number;
}

export interface WeeklyResult {
  id: string;
  team_id: string;
  week: number;
  points: number;
  opponent_id: string;
  opponent_points: number;
  top_player: boolean;
  top_points: boolean;
}

export interface WeeklyWriteup {
  id: string;
  week: number;
  content: string;
}