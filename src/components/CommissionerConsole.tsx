import React, { useState } from 'react';
import { useStore } from '../store';
import { Team } from '../types';
import toast from 'react-hot-toast';

export const CommissionerConsole: React.FC = () => {
  // ... existing state and handlers remain the same ...

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-6 space-y-4 sm:space-y-8">
      <section className="retro-card">
        <h2 className="text-lg sm:text-xl mb-4">Add Team</h2>
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
          <button type="submit" className="retro-button w-full sm:w-auto">Add Team</button>
        </form>
      </section>

      <section className="retro-card">
        <h2 className="text-lg sm:text-xl mb-4">Team Results Overview</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[800px] px-4 sm:px-0">
            <table className="w-full commissioner-table">
              {/* ... existing table content ... */}
            </table>
          </div>
        </div>
      </section>

      <section className="retro-card">
        <h2 className="text-lg sm:text-xl mb-4">Enter Matchup Results</h2>
        <form onSubmit={handleAddResult} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 matchup-form">
            <select
              className="retro-input"
              value={matchup.week}
              onChange={e => setMatchup(prev => ({ ...prev, week: e.target.value }))}
            >
              {weeks.map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
            <div className="hidden sm:block"></div>
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
          <button type="submit" className="retro-button w-full sm:w-auto">Submit Results</button>
        </form>
      </section>

      <section className="retro-card">
        <h2 className="text-lg sm:text-xl mb-4">Weekly Write-up</h2>
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
          <button type="submit" className="retro-button w-full sm:w-auto">Submit Write-up</button>
        </form>
      </section>
    </div>
  );
};
