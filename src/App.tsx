import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { useStore } from './store';
import { TeamCard } from './components/TeamCard';
import { TeamHistory } from './components/TeamHistory';
import { CommissionerConsole } from './components/CommissionerConsole';
import { Team } from './types';
import { Toaster } from 'react-hot-toast';

function App() {
  const { 
    teams,
    results,
    writeup,
    isCommissioner,
    setCommissioner,
    fetchTeams,
    fetchResults,
    fetchWriteup
  } = useStore();

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchTeams();
    fetchResults();
    fetchWriteup();
  }, [fetchTeams, fetchResults, fetchWriteup]);

  const handlePasswordSubmit = () => {
    if (password === 'wolfpack69!') {
      setCommissioner(true);
      setShowPasswordModal(false);
      setPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-6">
      <Toaster position="top-right" />
      
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

      {!isCommissioner && (
        <button
          onClick={() => setShowPasswordModal(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 retro-button flex items-center gap-2"
        >
          <Lock size={16} />
          Commish Login
        </button>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="retro-card w-full max-w-md">
            <h2 className="text-lg sm:text-xl mb-4">Commissioner Login</h2>
            <input
              type="password"
              className="retro-input w-full mb-4"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Enter password..."
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="retro-button bg-red-600 hover:bg-red-700 border-red-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="retro-button"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {isCommissioner && <CommissionerConsole />}
    </div>
  );
}

export default App;
