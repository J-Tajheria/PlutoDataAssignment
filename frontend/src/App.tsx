import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import DropDownMenu from './components/DropDownMenu';
import HistoricalGames from './components/HistoricalGames';
import Histogram from './components/Histogram';
import { Team, Venue, HistogramDataPoint, MatchDetails } from './types';

function App() {
  // Navigation state
  const [showHistoricalGames, setShowHistoricalGames] = useState(false);
  const [showCustomMatchUps, setShowCustomMatchUps] = useState(false);
  
  // Data from API
  const [venues, setVenues] = useState<Venue[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  // User selections for simulation
  const [selectedTeamA, setSelectedTeamA] = useState<string>('');
  const [selectedTeamB, setSelectedTeamB] = useState<string>('');
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  
  // Simulation results
  const [simulationData, setSimulationData] = useState<HistogramDataPoint[]>([]);
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [hasAttemptedSimulation, setHasAttemptedSimulation] = useState(false);

  // App state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8000';

  // Load initial data when component mounts
  useEffect(() => {
    fetchVenues();
    fetchTeams();
  }, []);

// Fetch venues from the API
  const fetchVenues = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/venues`);
      setVenues(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch venues';
      setError(`Unable to load venues: ${errorMessage}`);
      console.error('Error fetching venues:', err);
    } finally {
      setIsLoading(false);
    }
  }

// Fetch teams from the API
  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/teams`);
      setTeams(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch teams';
      setError(`Unable to load teams: ${errorMessage}`);
      console.error('Error fetching teams:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Check if user has selected all required options for simulation
  const allOptionsSelected = selectedTeamA && selectedTeamB && selectedVenue;

  /**
   * Run simulation with selected teams and venue
   * Updates simulation data and match details on success
   * Sets error state if simulation fails
   */
  const handleEnterClick = async () => {
    if (allOptionsSelected) {
      setError(null);
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
        setHasAttemptedSimulation(true);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Simulation failed';
        setError(`Simulation failed: ${errorMessage}`);
        console.error('Simulation failed:', error);
      }
    }
  };

  /**
   * Reset all simulation-related state
   * Called when switching between views
   */
  const clearSelections = () => {
    setSelectedTeamA('');
    setSelectedTeamB('');
    setSelectedVenue('');
    setSimulationData([]);
    setMatchDetails(null);
    setHasAttemptedSimulation(false);
    setError(null);
  };

  /**
   * Toggle Historical Games view
   * Clears simulation data when switching
   */
  const handleHistoricalGamesClick = () => {
    setShowHistoricalGames(!showHistoricalGames);
    setShowCustomMatchUps(false);
    clearSelections();
  };

  /**
   * Toggle Custom Match Ups view
   * Clears simulation data when switching
   */
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
        {/* Loading State */}
        {isLoading && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800 font-medium">Loading application data...</span>
            </div>
          </div>
        )}

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
            
            {/* Error Display */}
            {error && (
              <div className="w-full max-w-4xl p-6 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-800 font-medium">Error</span>
                </div>
                <p className="text-red-700 mb-3">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Dismiss
                </button>
              </div>
            )}
            
            {/* Simulation button and results */}
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
                    matchDetails={matchDetails}
                    hasAttemptedSimulation={hasAttemptedSimulation}
                    error={error}
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
