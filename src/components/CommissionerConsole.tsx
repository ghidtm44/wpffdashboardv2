import React, { useState } from 'react';
import { useStore } from '../store';
import { Team } from '../types';
import toast from 'react-hot-toast';

export const CommissionerConsole: React.FC = () => {
  const { teams, results, addTeam, addResult, addWriteup } = useStore();
  const [newTeam, setNewTeam] = useState({ name: '', manager: '' });
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [matchup, setMatchup] = useState({
    week: '1',
    team1: '',
    team2: '',
    score1: '',
    score2: '',
  });
  const [writeup, setWriteup] = useState({ week: '1', content: '' });

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.manager) {
      toast.error('Please fill in all team details');
      return;
    }
    
    try {
      await addTeam(newTeam.name, newTeam.manager);
      setNewTeam({ name: '', manager: '' });
    } catch (error) {
      toast.error('Failed to add team');
    }
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchup.team1 || !matchup.team2 || !matchup.score1 || !matchup.score2) {
      toast.error('Please fill in all matchup details');
      return;
    }

    try {
      await addResult({
        team_id: matchup.team1,
        opponent_id: matchup.team2,
        week: parseInt(matchup.week),
        points: Number(matchup.score1),
        opponent_points: Number(matchup.score2),
        top_player: false,
        top_points: false,
      });

      await addResult({
        team_id: matchup.team2,
        opponent_id: matchup.team1,
        week: parseInt(matchup.week),
        points: Number(matchup.score2),
        opponent_points: Number(matchup.score1),
        top_player: false,
        top_points: false,
      });

      setMatchup({
        week: matchup.week,
        team1: '',
        team2: '',
        score1: '',
        score2: '',
      });
    } catch (error) {
      toast.error('Failed to add results');
    }
  };

  const handleWriteup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeup.content) {
      toast.error('Please enter a write-up');
      return;
    }

    try {
      await addWriteup(parseInt(writeup.week), writeup.content);
      setWriteup(prev => ({ ...prev, content: '' }));
    } catch (error) {
      toast.error('Failed to add write-up');
    }
  };

  const weeks = Array.from({ length: 17 }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <section className="retro-card">
        <h2 className="text-xl mb-4">Add Team</h2>
        <form onSubmit={handleAddTeam} className="space-y-4">
          <input
            type="text"
            placeholder="Team Name"
            className="retro-input w-full"
            value={newTeam.name}
            onChange={e => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Manager Name"
            className="retro-input w-full"
            value={newTeam.manager}
            onChange={e => setNewTeam(prev => ({ ...prev, manager: e.target.value }))}
          />
          <button type="submit" className="retro-button">Add Team</button>
        </form>
      </section>

      <section className="retro-card">
        <h2 className="text-xl mb-4">Team Results Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Team</th>
                {weeks.map(week => (
                  <th key={week} className="p-2 text-center">W{week}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.map(team => (
                <tr key={team.id} className="border-t border-gray-700">
                  <td className="p-2">{team.name}</td>
                  {weeks.map(week => {
                    const result = results.find(
                      r => r.team_id === team.id && r.week === week
                    );
                    return (
                      <td key={week} className="p-2 text-center">
                        {result && (
                          <div className="space-y-1">
                            <div className={`text-xs ${
                              result.points > result.opponent_points
                                ? 'text-green-400'
                                : 'text-red-400'
                            }`}>
                              {result.points > result.opponent_points ? 'W' : 'L'}
                            </div>
                            <div className="flex justify-center gap-1">
                              <label className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  className="retro-checkbox"
                                  checked={result.top_player}
                                  onChange={async () => {
                                    try {
                                      await addResult({
                                        ...result,
                                        top_player: !result.top_player,
                                      });
                                    } catch (error) {
                                      toast.error('Failed to update');
                                    }
                                  }}
                                />
                                <span className="text-xs ml-1">TP</span>
                              </label>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="retro-card">
        <h2 className="text-xl mb-4">Enter Matchup Results</h2>
        <form onSubmit={handleAddResult} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              className="retro-input"
              value={matchup.week}
              onChange={e => setMatchup(prev => ({ ...prev, week: e.target.value }))}
            >
              {weeks.map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
            <div className="col-span-1"></div>
            <select
              className="retro-input"
              value={matchup.team1}
              onChange={e => setMatchup(prev => ({ ...prev, team1: e.target.value }))}
            >
              <option value="">Select Team 1</option>
              {teams.map((team: Team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <select
              className="retro-input"
              value={matchup.team2}
              onChange={e => setMatchup(prev => ({ ...prev, team2: e.target.value }))}
            >
              <option value="">Select Team 2</option>
              {teams.map((team: Team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Team 1 Score"
              className="retro-input"
              value={matchup.score1}
              onChange={e => setMatchup(prev => ({ ...prev, score1: e.target.value }))}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Team 2 Score"
              className="retro-input"
              value={matchup.score2}
              onChange={e => setMatchup(prev => ({ ...prev, score2: e.target.value }))}
            />
          </div>
          <button type="submit" className="retro-button">Submit Results</button>
        </form>
      </section>

      <section className="retro-card">
        <h2 className="text-xl mb-4">Weekly Write-up</h2>
        <form onSubmit={handleWriteup} className="space-y-4">
          <select
            className="retro-input w-full mb-4"
            value={writeup.week}
            onChange={e => setWriteup(prev => ({ ...prev, week: e.target.value }))}
          >
            {weeks.map(week => (
              <option key={week} value={week}>Week {week}</option>
            ))}
          </select>
          <textarea
            className="retro-input w-full h-32"
            placeholder="Enter weekly write-up..."
            value={writeup.content}
            onChange={e => setWriteup(prev => ({ ...prev, content: e.target.value }))}
          />
          <button type="submit" className="retro-button">Submit Write-up</button>
        </form>
      </section>
    </div>
  );
};
