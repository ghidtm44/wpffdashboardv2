import React from 'react';
import { Trophy, X } from 'lucide-react';
import { LeagueHistory } from '../types';

interface LeagueHistoryModalProps {
  history: LeagueHistory[];
  onClose: () => void;
}

export const LeagueHistoryModal: React.FC<LeagueHistoryModalProps> = ({ history, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="retro-card w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            League Champions
          </h2>
          <button 
            onClick={onClose}
            className="retro-button"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          {history.map((entry) => (
            <div 
              key={entry.id}
              className="p-4 bg-gray-800 rounded-lg border-2 border-gray-700"
            >
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-yellow-400">{entry.year}</div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{entry.champion_name}</div>
                  <div className="text-sm text-gray-400">Manager: {entry.champion_manager}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
