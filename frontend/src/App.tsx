import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import DropDownMenu from './components/DropDownMenu';
import HistoricalGames from './components/HistoricalGames';
import Histogram from './components/Histogram';

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
  
  // Track selected values for dropdowns
  const [selectedTeamA, setSelectedTeamA] = useState<string>('');
  const [selectedTeamB, setSelectedTeamB] = useState<string>('');
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  
  // Simulation data state
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [hasAttemptedSimulation, setHasAttemptedSimulation] = useState(false);

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

  // Check if all dropdowns are selected
  const allOptionsSelected = selectedTeamA && selectedTeamB && selectedVenue;

  // Handle enter button click
  const handleEnterClick = async () => {
    if (allOptionsSelected) {
      setIsSimulating(true);
      setHasAttemptedSimulation(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/api/simulations/simulate-match`, {
          team_a: parseInt(selectedTeamA),
          team_b: parseInt(selectedTeamB),
          venue: parseInt(selectedVenue)
        });
        
        console.log('Simulation results:', response.data);
        setSimulationData(response.data.histogram_data);
        setMatchDetails({
          team_a: response.data.team_a,
          team_b: response.data.team_b,
          venue: response.data.venue,
          home_win_percentage: response.data.home_win_percentage,
          total_simulations: response.data.total_simulations
        });
      } catch (error) {
        console.error('Simulation failed:', error);
      } finally {
        setIsSimulating(false);
      }
    }
  };

  // Clear dropdown selections
  const clearSelections = () => {
    setSelectedTeamA('');
    setSelectedTeamB('');
    setSelectedVenue('');
    setSimulationData([]);
    setMatchDetails(null);
    setHasAttemptedSimulation(false);
  };

  // Handle navigation to Historical Games
  const handleHistoricalGamesClick = () => {
    setShowHistoricalGames(!showHistoricalGames);
    setShowCustomMatchUps(false);
    clearSelections();
  };

  // Handle navigation to Custom Match Ups
  const handleCustomMatchUpsClick = () => {
    setShowCustomMatchUps(!showCustomMatchUps);
    setShowHistoricalGames(false);
    if (!showCustomMatchUps) {
      clearSelections(); // Clear when entering Custom Match Ups
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-2">PlutoData Assignment</h1>
      </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation buttons */}
        <div className='flex justify-center items-center mb-8 p-4 rounded-lg' style={{ gap: '3rem' }}>
          <button className="text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold border-2 border-gray-400" 
           onClick={handleHistoricalGamesClick}>
            Historical Games
          </button>
          <button className="text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold border-2 border-gray-400"
           onClick={handleCustomMatchUpsClick}>
            Custom Match Ups
          </button>
        </div>
        
         {showHistoricalGames && (
           <HistoricalGames />
         )}
        {showCustomMatchUps && (
          <div className="flex flex-col items-center space-y-8">
            <section className='custom-matchups-section'>
              <div>
               <DropDownMenu 
               label='Team A'
               options={teams
                 .filter(team => team.id.toString() !== selectedTeamB)
                 .map(team => ({ label: team.name, value: team.id.toString() }))}
               onSelect={setSelectedTeamA}/>
              </div>
              <div>
               <DropDownMenu
               label='Team B'
               options={teams
                 .filter(team => team.id.toString() !== selectedTeamA)
                 .map(team => ({ label: team.name, value: team.id.toString() }))}
               onSelect={setSelectedTeamB} />
              </div>
              <div>
               <DropDownMenu 
               label='Venue'
               options={venues.map(venue => ({ label: venue.name, value: venue.id.toString() }))}
               onSelect={setSelectedVenue}/>
              </div>
            </section>
            
            {/* Enter button - only show when all options are selected */}
            {allOptionsSelected && (
              <div>
              <div className="p-6">
                <button 
                  onClick={handleEnterClick}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 border-2 border-green-700"
                >
                  🚀 Enter Match
                </button>
              </div>
              <div>
                <Histogram 
                  data={simulationData} 
                  isLoading={isSimulating}
                  matchDetails={matchDetails}
                  hasAttemptedSimulation={hasAttemptedSimulation}
                />
              </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
