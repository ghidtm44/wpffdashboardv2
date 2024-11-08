import React, { useEffect, useState } from 'react';
import { useStore } from './store';
import { TeamCard } from './components/TeamCard';
import { TeamHistory } from './components/TeamHistory';
import { CommissionerConsole } from './components/CommissionerConsole';
import { Navigation } from './components/Navigation';
import { LeagueHistoryModal } from './components/LeagueHistory';
import { Team } from './types';
import { Toaster } from 'react-hot-toast';

function App() {
  const { 
    teams,
    results,
    writeup,
    history,
    isCommissioner,
    fetchTeams,
    fetchResults,
    fetchWriteup,
    fetchHistory
  } = useStore();

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchTeams();
    fetchResults();
    fetchWriteup();
    fetchHistory();
  }, [fetchTeams, fetchResults, fetchWriteup, fetchHistory]);

  return (
    <div className="min-h-screen p-2 sm:p-6 pt-16">
      <Toaster position="top-right" />
      <Navigation onShowHistory={() => setShowHistory(true)} />
      
      <h1 className="retro-title">
        Welcome to the<br />Wolfpack Fantasy League
      </h1>

      {writeup && (
        <div className="max-w-4xl mx-auto mb-4 sm:mb-8 retro-card">
          <h2 className="text-lg sm:text-xl mb-4">Weekly Write-up</h2>
          <p className="text-xs sm:text-sm leading-relaxed">{writeup.content}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {teams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            results={results}
            onClick={() => setSelectedTeam(team)}
          />
        ))}
      </div>

      {selectedTeam && (
        <TeamHistory
          team={selectedTeam}
          results={results}
          onClose={() => setSelectedTeam(null)}
        />
      )}

      {showHistory && (
        <LeagueHistoryModal
          history={history}
          onClose={() => setShowHistory(false)}
        />
      )}

      {isCommissioner && <CommissionerConsole />}
    </div>
  );
}

export default App;
