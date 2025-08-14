import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Game {
  id: number;
  home_team: string;
  away_team: string;
  venue_id: string;
  date: string;
  result: string;
}

interface Venue {
    id: number;
    name: string;
    home_multiplier: number;
}

const HistoricalGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchGames();
      await fetchVenues();
      setLoading(false);
    };
    loadData();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/games`);
      setGames(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch historical games');
      console.error('Error fetching games:', err);
    }
  };

  const fetchVenues = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/venues`);
        setVenues(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch venues');
        console.error('Error fetching venues:', err);
      }
  }

  const getVenueName = (venueId: string): string => {
    if (!venueId) return 'Unknown Venue';
    const venue = venues.find(v => v.id && v.id.toString() === venueId.toString());
    return venue ? venue.name : 'Unknown Venue';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Historical Games</h2>
      
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
        <div className="space-y-4">
          {games.map((game) => (
            <div key={game.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    {game.home_team} vs {game.away_team}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {getVenueName(game.venue_id)} • {game.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
            )}
    </div>
  );
};

export default HistoricalGames;
