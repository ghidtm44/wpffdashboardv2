import React from 'react';
import { Trophy, Flame, Snowflake, Crown, Star, Shield } from 'lucide-react';
import { Team, WeeklyResult } from '../types';
import { useStore } from '../store';

interface TeamCardProps {
  team: Team;
  results: WeeklyResult[];
  onClick: () => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, results, onClick }) => {
  const { getTopScoringTeam } = useStore();
  const teamResults = results.filter(r => r.team_id === team.id);
  const streak = calculateStreak(teamResults);
  const cardClass = getCardClass(streak);
  
  // Calculate statistics
  const stats = calculateStats(teamResults);
  
  // Get the most recent week
  const latestWeek = Math.max(...results.map(r => r.week), 0);
  const isTopScorer = getTopScoringTeam(latestWeek) === team.id;
  
  return (
    <div 
      className={`retro-card cursor-pointer ${cardClass}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl">{team.name}</h3>
        {isTopScorer && (
          <Crown className="text-yellow-400" size={20} />
        )}
      </div>
      <p className="text-sm mb-2">Manager: {team.manager}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Trophy size={16} />
          <span>{team.wins}-{team.losses}</span>
        </div>
        {getStreakDisplay(streak)}
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <Shield size={14} className="text-green-400" />
          <div>
            <span className="stat-label">PF: </span>
            <span className="stat-value">{stats.pointsFor.toFixed(1)}</span>
          </div>
        </div>
        <div className="stat-item">
          <Shield size={14} className="text-red-400" />
          <div>
            <span className="stat-label">PA: </span>
            <span className="stat-value">{stats.pointsAgainst.toFixed(1)}</span>
          </div>
        </div>
        <div className="stat-item">
          <Crown size={14} className="text-yellow-400" />
          <div>
            <span className="stat-label">Top Score: </span>
            <span className="stat-value">{stats.topScoreCount}</span>
          </div>
        </div>
        <div className="stat-item">
          <Star size={14} className="text-yellow-400" />
          <div>
            <span className="stat-label">Top Player: </span>
            <span className="stat-value">{stats.topPlayerCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function calculateStats(results: WeeklyResult[]) {
  return {
    pointsFor: results.reduce((sum, result) => sum + result.points, 0),
    pointsAgainst: results.reduce((sum, result) => sum + result.opponent_points, 0),
    topScoreCount: results.filter(result => result.top_points).length,
    topPlayerCount: results.filter(result => result.top_player).length,
  };
}

function calculateStreak(results: WeeklyResult[]): number {
  let streak = 0;
  const sortedResults = [...results].sort((a, b) => b.week - a.week);
  
  for (const result of sortedResults) {
    const isWin = result.points > result.opponent_points;
    if (streak === 0) {
      streak = isWin ? 1 : -1;
    } else if ((streak > 0 && isWin) || (streak < 0 && !isWin)) {
      streak = streak + (isWin ? 1 : -1);
    } else {
      break;
    }
  }
  
  return streak;
}

function getCardClass(streak: number): string {
  if (streak >= 3) return 'on-fire';
  if (streak === 2) return 'heating-up';
  if (streak <= -3) return 'frozen';
  if (streak === -2) return 'cooling-off';
  return '';
}

function getStreakDisplay(streak: number) {
  if (streak >= 3) return <><Flame className="text-orange-500" /> On Fire!</>;
  if (streak === 2) return <><Flame className="text-orange-300" /> Heating Up</>;
  if (streak <= -3) return <><Snowflake className="text-blue-500" /> Frozen</>;
  if (streak === -2) return <><Snowflake className="text-blue-300" /> Cooling Off</>;
  return null;
}
