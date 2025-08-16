# PlutoDataAssignment

A cricket simulation application with TypeScript React frontend and Python FastAPI backend that allows users to view historical games and simulate custom matchups.

## Project Structure

```
PlutoDataAssignment/
├── frontend/          # TypeScript React application
├── backend/           # Python FastAPI application
├── data/              # CSV data files
│   ├── games.csv      # Historical game data
│   ├── simulations.csv # Team simulation results
│   └── venues.csv     # Venue information with home multipliers
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

## Features

### Historical Games
- View all historical cricket matchups in a responsive grid layout
- See team names, venues, dates, and results
- Cards display in a 4x4 grid format on larger screens

### Custom Matchups
- Select any two teams to face each other
- Choose from available venues
- Automatic filtering prevents selecting the same team twice
- Real-time simulation with venue effects

### Simulation Results
- Side-by-side histogram showing both teams' score distributions
- Home team advantage applied via venue multipliers
- Win percentage calculation for the home team
- Based on all possible simulation combinations

## Setup Instructions

### Quick Start (Recommended)
1. Make sure you have Python 3.8+ and Node.js installed
2. Run the start script: `./start.sh`
3. Open http://localhost:5173 in your browser

### Manual Setup

#### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python3 -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Set up the database: `python setup_database.py`
6. Run the server: `uvicorn main:app --reload`

The backend will be available at `http://localhost:8000`

#### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/{team_id}` - Get specific team

### Venues
- `GET /api/venues` - Get all venues with home multipliers

### Games
- `GET /api/games` - Get all historical games

### Simulations
- `GET /api/simulations` - Get simulation data (with optional team filter)
- `POST /api/simulations/simulate-match` - Run custom matchup simulation

## Data Structure

### Venues
- `id`: Unique venue identifier
- `name`: Venue name
- `home_multiplier`: Performance boost for home team (e.g., 1.2 = 20% boost)

### Teams
- `id`: Unique team identifier
- `name`: Team name

### Games (Historical)
- `home_team`: Home team name
- `away_team`: Away team name
- `date`: Game date
- `venue_id`: Venue where game was played

### Simulations
- `team_id`: Team identifier
- `simulation_run`: Run number
- `results`: Score for this simulation run

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts
- **Backend**: Python 3.8+, FastAPI, Uvicorn, SQLite
- **Database**: SQLite with proper relational schema
- **Data Visualization**: Recharts for histogram display

## How It Works

1. **Historical Games**: Displays past matchups from the games.csv data
2. **Custom Matchups**: 
   - User selects two teams and a venue
   - System combines all simulation runs from both teams
   - Applies venue multiplier to home team scores
   - Calculates win percentage based on head-to-head comparisons
   - Displays results in side-by-side histogram
3. **Venue Effects**: Home team gets performance boost based on venue's home_multiplier
4. **Win Percentage**: Shows percentage of simulations where home team wins