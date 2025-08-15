import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import DropDownMenu from './components/DropDownMenu';
import HistoricalGames from './components/HistoricalGames';

interface Team {
  id: number
  name: string
}

interface Venue {
  id: number;
  name: string;
  home_multiplier: number;
}

function App() {
  const [showHistoricalGames, setShowHistoricalGames] = useState(false);
  const [showCustomMatchUps, setShowCustomMatchUps] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchVenues();
    fetchTeams();
  }, []);

  const fetchVenues = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/venues`);
        setVenues(response.data);
        // setError(null);
      } catch (err) {
        // setError('Failed to fetch venues');
        console.error('Error fetching venues:', err);
      }
  }

  const fetchTeams = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/teams`);
        setTeams(response.data);
        // setError(null);
      } catch (err) {
        // setError('Failed to fetch teams');
        console.error('Error fetching teams:', err);
      }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-2">PlutoData Assignment</h1>
      </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation buttons */}
        <div className='flex justify-center items-center mb-8' style={{ gap: '3rem' }}>
          <button className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold" 
           onClick={() => {
             setShowHistoricalGames(!showHistoricalGames);
             setShowCustomMatchUps(false);
           }}>
            Historical Games
          </button>
          <button className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
           onClick={() => {
             setShowCustomMatchUps(!showCustomMatchUps);
             setShowHistoricalGames(false);
           }}>
            Custom Match Ups
          </button>
        </div>
        
         {showHistoricalGames && (
           <HistoricalGames />
         )}
        {showCustomMatchUps && (
                      <section className='flex justify-center items-center' style={{ gap: '3rem' }}>
              <div>
               <DropDownMenu 
               label='Team A'
               options={teams.map(team => ({ label: team.name, value: team.id.toString() }))}/>
              </div>
              <div>
               <DropDownMenu
               label='Team B'
               options={teams.map(team => ({ label: team.name, value: team.id.toString() }))} />
              </div>
              <div>
               <DropDownMenu 
               label='Venue'
               options={venues.map(venue => ({ label: venue.name, value: venue.id.toString() }))}/>
              </div>
            </section>
        )}
      </main>
    </div>
  )
}

export default App
