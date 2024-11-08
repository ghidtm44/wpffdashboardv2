import React from 'react';
import { Trophy, Star, Crown } from 'lucide-react';
import { Team, WeeklyResult } from '../types';
import { useStore } from '../store';

interface TeamHistoryProps {
  team: Team;
  results: WeeklyResult[];
  onClose: () => void;
}

export const TeamHistory: React.FC<TeamHistoryProps> = ({ team, results, onClose }) => {
  const { getTopScoringTeam, teams } = useStore();
  const teamResults = results
    .filter(r => r.team_id === team.id)
    .sort((a, b) => b.week - a.week);

  const getOpponentName = (opponentId: string) => {
    const opponent = teams.find(t => t.id === opponentId);
    return opponent?.name || 'Unknown Team';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="retro-card w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl">{team.name} History</h2>
          <button 
            onClick={onClose}
            className="retro-button"
          >
            Close
          </button>
        </div>
        
        <div className="space-y-4">
          {teamResults.map((result) => {
            const isTopScorer = getTopScoringTeam(result.week) === team.id;
            const isWinner = result.points > result.opponent_points;
            const opponentName = getOpponentName(result.opponent_id);
            
            return (
              <div 
                key={result.id}
                className={`p-4 rounded ${
                  isWinner 
                    ? 'bg-green-900 bg-opacity-50' 
                    : 'bg-red-900 bg-opacity-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg">Week {result.week}</span>
                  <div className="flex gap-2">
                    {result.top_player && (
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400" size={16} />
                        <span className="text-xs">Top Player</span>
                      </div>
                    )}
                    {isTopScorer && (
                      <div className="flex items-center gap-1">
                        <Crown className="text-yellow-400" size={16} />
                        <span className="text-xs">Top Score</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="font-bold">{team.name}</span>
                      <div className="text-lg">{result.points} pts</div>
                    </div>
                    <div className="flex-none px-4">
                      <Trophy 
                        size={20}
                        className={isWinner 
                          ? 'text-green-400' 
                          : 'text-red-400'
                        } 
                      />
                    </div>
                    <div className="flex-1 text-right">
                      <span className="font-bold">{opponentName}</span>
                      <div className="text-lg">{result.opponent_points} pts</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
