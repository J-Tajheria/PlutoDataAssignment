import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Game {
  home_team: string;
  away_team: string;
  venue_id: string;
  date: string;
  venue_name: string;
  home_multiplier: number;
  simulated_home_score?: number;
  simulated_away_score?: number;
  home_win_percentage?: number;
  total_simulations?: number;
}

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
    console.log('Game clicked at index:', index);
    if (selectedGameIndex === index) {
      setSelectedGameIndex(null); // Close if same card clicked
    } else {
      setSelectedGameIndex(index); // Open new card
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading historical games...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && games.length === 0 && (
        <div className="text-gray-600 text-center py-8">
          No historical games found.
        </div>
      )}
      
      {!loading && games.length > 0 && (
        <div className="games-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {games.map((game, index) => (
            <div key={index}>
              <div 
                className="border-2 border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => handleGameClick(index)}
              >
                <div className="text-center">
                  <div className="font-semibold text-gray-800 text-lg mb-2">
                    {game.home_team} vs {game.away_team}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {game.venue_name}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {game.date}
                  </div>
                  {game.simulated_home_score !== null && game.simulated_away_score !== null && (
                    <div className="text-sm font-medium text-blue-600">
                      Simulated: {game.simulated_home_score} - {game.simulated_away_score}
                    </div>
                  )}
                  {game.home_win_percentage !== null && (
                    <div className="text-xs text-green-600 mt-1">
                      {game.home_team} wins {game.home_win_percentage}%
                    </div>
                  )}
                </div>
              </div>
              
              {/* Inline details view */}
              {selectedGameIndex === index && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-center">
                    {game.home_team} vs {game.away_team} - Detailed View
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Venue:</span> {game.venue_name}
                    </div>
                    <div>
                      <span className="font-semibold">Date:</span> {game.date}
                    </div>
                    <div>
                      <span className="font-semibold">Home Advantage:</span> +{((game.home_multiplier - 1) * 100).toFixed(0)}%
                    </div>
                    
                    {game.simulated_home_score !== null && game.simulated_away_score !== null && (
                      <>
                        <div className="border-t pt-2 mt-2">
                          <div className="font-semibold mb-2">Simulated Results</div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-blue-600">
                              {game.simulated_home_score} - {game.simulated_away_score}
                            </div>
                            <div className="text-xs text-gray-600">
                              Based on {game.total_simulations} simulations
                            </div>
                          </div>
                        </div>
                        
                        {game.home_win_percentage !== null && (
                          <div className="text-center">
                            <div className="font-semibold text-green-600">
                              {game.home_team} wins {game.home_win_percentage}% of simulations
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="mt-3 text-center">
                    <button 
                      onClick={() => setSelectedGameIndex(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
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
