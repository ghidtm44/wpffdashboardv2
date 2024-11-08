import React from 'react';
import { Trophy, Star, Target } from 'lucide-react';
import { Team, WeeklyResult } from '../types';

interface TeamHistoryProps {
  team: Team;
  results: WeeklyResult[];
  onClose: () => void;
}

export const TeamHistory: React.FC<TeamHistoryProps> = ({ team, results, onClose }) => {
  const teamResults = results
    .filter(r => r.team_id === team.id)
    .sort((a, b) => a.week - b.week);

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
          {teamResults.map((result) => (
            <div 
              key={result.id}
              className={`p-4 rounded ${
                result.points > result.opponent_points 
                  ? 'bg-green-900 bg-opacity-50' 
                  : 'bg-red-900 bg-opacity-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>Week {result.week}</span>
                <div className="flex gap-2">
                  {result.top_player && (
                    <Star className="text-yellow-400" size={16} />
                  )}
                  {result.top_points && (
                    <Target className="text-purple-400" size={16} />
                  )}
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span>{result.points} pts</span>
                <Trophy 
                  size={16}
                  className={result.points > result.opponent_points 
                    ? 'text-green-400' 
                    : 'text-red-400'
                  } 
                />
                <span>{result.opponent_points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}