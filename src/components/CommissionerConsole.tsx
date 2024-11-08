import React, { useState } from 'react';
import { useStore } from '../store';
import { Team } from '../types';

export const CommissionerConsole: React.FC = () => {
  const { teams, addTeam, addResult, addWriteup } = useStore();
  const [newTeam, setNewTeam] = useState({ name: '', manager: '' });
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [matchup, setMatchup] = useState({
    team1: '',
    team2: '',
    score1: '',
    score2: '',
    topPlayer: '',
    topPoints: '',
  });
  const [writeup, setWriteup] = useState('');

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    addTeam(newTeam.name, newTeam.manager);
    setNewTeam({ name: '', manager: '' });
  };

  const handleAddResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchup.team1 || !matchup.team2) return;

    addResult({
      team_id: matchup.team1,
      opponent_id: matchup.team2,
      week: selectedWeek,
      points: Number(matchup.score1),
      opponent_points: Number(matchup.score2),
      top_player: matchup.topPlayer === matchup.team1,
      top_points: matchup.topPoints === matchup.team1,
    });

    addResult({
      team_id: matchup.team2,
      opponent_id: matchup.team1,
      week: selectedWeek,
      points: Number(matchup.score2),
      opponent_points: Number(matchup.score1),
      top_player: matchup.topPlayer === matchup.team2,
      top_points: matchup.topPoints === matchup.team2,
    });

    setMatchup({
      team1: '',
      team2: '',
      score1: '',
      score2: '',
      topPlayer: '',
      topPoints: '',
    });
  };

  const handleWriteup = (e: React.FormEvent) => {
    e.preventDefault();
    addWriteup(selectedWeek, writeup);
    setWriteup('');
  };

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
        <h2 className="text-xl mb-4">Enter Matchup Results</h2>
        <form onSubmit={handleAddResult} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              placeholder="Team 1 Score"
              className="retro-input"
              value={matchup.score1}
              onChange={e => setMatchup(prev => ({ ...prev, score1: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Team 2 Score"
              className="retro-input"
              value={matchup.score2}
              onChange={e => setMatchup(prev => ({ ...prev, score2: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              className="retro-input"
              value={matchup.topPlayer}
              onChange={e => setMatchup(prev => ({ ...prev, topPlayer: e.target.value }))}
            >
              <option value="">Top Player</option>
              <option value={matchup.team1}>Team 1</option>
              <option value={matchup.team2}>Team 2</option>
            </select>
            <select
              className="retro-input"
              value={matchup.topPoints}
              onChange={e => setMatchup(prev => ({ ...prev, topPoints: e.target.value }))}
            >
              <option value="">Top Points</option>
              <option value={matchup.team1}>Team 1</option>
              <option value={matchup.team2}>Team 2</option>
            </select>
          </div>
          <button type="submit" className="retro-button">Submit Results</button>
        </form>
      </section>

      <section className="retro-card">
        <h2 className="text-xl mb-4">Weekly Write-up</h2>
        <form onSubmit={handleWriteup} className="space-y-4">
          <textarea
            className="retro-input w-full h-32"
            placeholder="Enter weekly write-up..."
            value={writeup}
            onChange={e => setWriteup(e.target.value)}
          />
          <button type="submit" className="retro-button">Submit Write-up</button>
        </form>
      </section>
    </div>
  );
};