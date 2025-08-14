import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Dropdown from './components/dropdown';

interface Item {
  id?: number
  name: string
  description?: string
}

function App() {
  const [showHistoricalGames, setShowHistoricalGames] = useState(false);
  const [showCustomMatchUps, setShowCustomMatchUps] = useState(false);

  const API_BASE_URL = 'http://localhost:8000'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-2">PlutoData Assignment</h1>
        <p className="text-xl opacity-90">A minimal React + FastAPI application</p>
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
          <div>
            HELLO DUDE
          </div>
        )}
        {showCustomMatchUps && (
          <div>
            <Dropdown />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
