import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import DropDownMenu from './components/DropDownMenu';
import HistoricalGames from './components/HistoricalGames';
import Histogram from './components/Histogram';
import { Team, Venue, HistogramDataPoint, MatchDetails } from './types';

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
  const [simulationData, setSimulationData] = useState<HistogramDataPoint[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
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
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/teams`);
      setTeams(response.data);
    } catch (err) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white py-12 px-6 text-center shadow-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-light mb-3 tracking-tight">Pluto Data</h1>
          <p className="text-slate-300 text-lg font-light">Sports Analytics & Simulation Platform</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation buttons */}
        <div className='flex justify-center items-center mb-12 p-6 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg' style={{ gap: '2rem' }}>
          <button 
            className={`px-10 py-5 rounded-xl font-medium transition-all duration-300 text-lg ${
              showHistoricalGames 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white/80 text-blue-700 hover:bg-white hover:shadow-md'
            }`}
            onClick={handleHistoricalGamesClick}
          >
            Historical Games
          </button>
          <button 
            className={`px-10 py-5 rounded-xl font-medium transition-all duration-300 text-lg ${
              showCustomMatchUps 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white/80 text-blue-700 hover:bg-white hover:shadow-md'
            }`}
            onClick={handleCustomMatchUpsClick}
          >
            Custom Match Ups
          </button>
        </div>
        
        {showHistoricalGames && (
          <HistoricalGames />
        )}
        
        {showCustomMatchUps && (
          <div className="flex flex-col items-center space-y-12">
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
              <div className="w-full flex flex-col items-center">
                <div className="text-center mb-8">
                  <button 
                    onClick={handleEnterClick}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-16 py-5 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
                  >
                    Run Simulation
                  </button>
                </div>
                <div className="max-w-4xl w-full">
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
