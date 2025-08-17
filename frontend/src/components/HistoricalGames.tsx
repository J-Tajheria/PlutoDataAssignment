import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Game } from '../types';

const HistoricalGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameIndex, setSelectedGameIndex] = useState<number | null>(null);

  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/games`);
      setGames(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch historical games');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (index: number) => {
    if (selectedGameIndex === index) {
      setSelectedGameIndex(null); // Close if same card clicked
    } else {
      setSelectedGameIndex(index); // Open new card
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
      
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
            <div className="text-slate-600 font-medium">Loading historical games...</div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 px-6 py-4 rounded-xl mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {!loading && games.length === 0 && (
        <div className="text-center py-16">
          <div className="text-slate-500 text-lg mb-2">No historical games found</div>
          <div className="text-slate-400 text-sm">Try refreshing the page or check your connection</div>
        </div>
      )}
      
      {!loading && games.length > 0 && (
        <div className="games-grid">
          {games.map((game, index) => (
            <div key={index}>
              <div 
                className="modern-card p-6 hover:cursor-pointer"
                onClick={() => handleGameClick(index)}
              >
                <div className="text-center">
                  <div className="font-semibold text-slate-800 text-xl mb-3">
                    {game.home_team} vs {game.away_team}
                  </div>
                  <div className="text-slate-600 mb-2 font-medium">
                    {game.venue_name}
                  </div>
                  <div className="text-slate-500 text-sm mb-3">
                    {new Date(game.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  {game.simulated_home_score !== null && game.simulated_away_score !== null && (
                    <div className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium mb-2">
                      Simulated: {game.simulated_home_score} - {game.simulated_away_score}
                    </div>
                  )}
                  {game.home_win_percentage !== null && (
                    <div className="text-emerald-600 text-sm font-medium">
                      {game.home_team} wins {game.home_win_percentage}%
                    </div>
                  )}
                </div>
              </div>
              
              {/* Inline details view */}
              {selectedGameIndex === index && (
                <div className="mt-4 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl">
                  <h4 className="font-semibold text-xl mb-4 text-center text-slate-800">
                    {game.home_team} vs {game.away_team} - Match Details
                  </h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                      <span className="font-medium text-slate-600">Venue:</span>
                      <span className="text-slate-800">{game.venue_name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                      <span className="font-medium text-slate-600">Date:</span>
                      <span className="text-slate-800">
                        {new Date(game.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                      <span className="font-medium text-slate-600">Home Advantage:</span>
                      <span className="text-slate-800">+{((game.home_multiplier - 1) * 100).toFixed(0)}%</span>
                    </div>
                    
                    {game.simulated_home_score !== null && game.simulated_away_score !== null && (
                      <>
                        <div className="mt-6 p-4 bg-white/60 rounded-xl">
                          <div className="font-semibold mb-3 text-slate-800 text-center">Simulation Results</div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-slate-800 mb-2">
                              {game.simulated_home_score} - {game.simulated_away_score}
                            </div>
                            <div className="text-slate-500 text-sm">
                              Based on {game.total_simulations?.toLocaleString()} simulations
                            </div>
                          </div>
                        </div>
                        
                        {game.home_win_percentage !== null && (
                          <div className="text-center mt-4">
                            <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-medium">
                              {game.home_team} wins {game.home_win_percentage}% of simulations
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button 
                      onClick={() => setSelectedGameIndex(null)}
                      className="bg-slate-600 text-white px-6 py-2 rounded-xl text-sm hover:bg-slate-700 transition-colors duration-200"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoricalGames;
