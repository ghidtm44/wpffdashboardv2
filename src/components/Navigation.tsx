import React, { useState } from 'react';
import { Menu, X, Home, Trophy, Lock } from 'lucide-react';
import { useStore } from '../store';

interface NavigationProps {
  onShowHistory: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onShowHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isCommissioner, setCommissioner } = useStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

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
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-90 z-50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="text-white font-bold">Wolfpack Fantasy</div>
          
          {!isCommissioner && (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Lock size={20} />
            </button>
          )}
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-gray-900 bg-opacity-90 border-t border-gray-800">
            <div className="max-w-7xl mx-auto py-2">
              <button
                onClick={() => {
                  window.location.reload();
                  setIsOpen(false);
                }}
                className="w-full text-left text-white p-3 hover:bg-gray-800 transition-colors flex items-center gap-3"
              >
                <Home size={20} />
                Home
              </button>
              <button
                onClick={() => {
                  onShowHistory();
                  setIsOpen(false);
                }}
                className="w-full text-left text-white p-3 hover:bg-gray-800 transition-colors flex items-center gap-3"
              >
                <Trophy size={20} />
                League History
              </button>
            </div>
          </div>
        )}
      </nav>

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
    </>
  );
};
