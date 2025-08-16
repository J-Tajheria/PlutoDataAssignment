from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import sqlite3

app = FastAPI(title="PlutoData API", version="1.0.0")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection function
def get_db_connection():
    conn = sqlite3.connect('plutodata.db')
    conn.row_factory = sqlite3.Row  # This allows accessing columns by name
    return conn

# Pydantic models
class Item(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

class Team(BaseModel):
    id: int
    name: str

class Venue(BaseModel):
    id: int
    name: str
    home_multiplier: float

class Game(BaseModel):
    id: int
    home_team: str
    away_team: str
    date: str
    venue_id: int
    venue_name: Optional[str] = None

class Simulation(BaseModel):
    id: int
    team_id: int
    simulation_run: int
    results: int
    team_name: Optional[str] = None

# Add this model for the request body
class SimulationRequest(BaseModel):
    team_a: int
    team_b: int
    venue: int

# In-memory storage (replace with database in production)
items_db = []
item_id_counter = 1

# get all historical games
#  get team names A
#  get team names B
#  GET VENUES

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "PlutoData API is running!", "status": "healthy"}

@app.get("/api/venues", response_model=List[Venue])
async def get_venues():
    """Get all venues from the database"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, home_multiplier FROM venues ORDER BY name")
        venues = cursor.fetchall()
        return [
            {
                "id": venue["id"], 
                "name": venue["name"], 
                "home_multiplier": venue["home_multiplier"]
            } 
            for venue in venues
        ]
    finally:
        conn.close()

@app.get("/api/venues/{venue_id}", response_model=Venue)
async def get_venue(venue_id: int):
    """Get a specific venue by ID"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, home_multiplier FROM venues WHERE id = ?", (venue_id,))
        venue = cursor.fetchone()
        if venue:
            return {
                "id": venue["id"], 
                "name": venue["name"], 
                "home_multiplier": venue["home_multiplier"]
            }
        raise HTTPException(status_code=404, detail="Venue not found")
    finally:
        conn.close()

@app.get("/api/games")
async def get_games():
    """Get all historical games with simulated results and venue effects"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT g.home_team, g.away_team, g.date, g.venue_id, v.name as venue_name, v.home_multiplier
            FROM games g
            JOIN venues v ON g.venue_id = v.id
            ORDER BY g.date DESC
        """)
        games = cursor.fetchall()
        
        # Get all teams for ID lookup
        cursor.execute("SELECT id, name FROM teams")
        teams = {team["name"]: team["id"] for team in cursor.fetchall()}
        
        games_with_simulations = []
        for game in games:
            home_team_name = game["home_team"]
            away_team_name = game["away_team"]
            venue_multiplier = game["home_multiplier"]
            
            # Get team IDs
            home_team_id = teams.get(home_team_name)
            away_team_id = teams.get(away_team_name)
            
            if home_team_id is not None and away_team_id is not None:
                # Get simulation data for both teams
                cursor.execute("SELECT results FROM simulations WHERE team_id = ?", (home_team_id,))
                home_simulations = [row[0] for row in cursor.fetchall()]
                
                cursor.execute("SELECT results FROM simulations WHERE team_id = ?", (away_team_id,))
                away_simulations = [row[0] for row in cursor.fetchall()]
                
                # Calculate simulated results with venue effects
                home_wins = 0
                total_simulations = 0
                home_scores = []
                away_scores = []
                
                for home_score in home_simulations:
                    for away_score in away_simulations:
                        # Apply venue multiplier to home team
                        adjusted_home_score = home_score * venue_multiplier
                        adjusted_away_score = away_score
                        
                        home_scores.append(adjusted_home_score)
                        away_scores.append(adjusted_away_score)
                        
                        total_simulations += 1
                        if adjusted_home_score > adjusted_away_score:
                            home_wins += 1
                
                # Calculate statistics
                home_win_percentage = (home_wins / total_simulations * 100) if total_simulations > 0 else 0
                avg_home_score = sum(home_scores) / len(home_scores) if home_scores else 0
                avg_away_score = sum(away_scores) / len(away_scores) if away_scores else 0
                
                games_with_simulations.append({
                    "home_team": home_team_name,
                    "away_team": away_team_name,
                    "date": game["date"],
                    "venue_id": game["venue_id"],
                    "venue_name": game["venue_name"],
                    "home_multiplier": venue_multiplier,
                    "simulated_home_score": round(avg_home_score, 1),
                    "simulated_away_score": round(avg_away_score, 1),
                    "home_win_percentage": round(home_win_percentage, 1),
                    "total_simulations": total_simulations
                })
            else:
                # Fallback for games without simulation data
                games_with_simulations.append({
                    "home_team": home_team_name,
                    "away_team": away_team_name,
                    "date": game["date"],
                    "venue_id": game["venue_id"],
                    "venue_name": game["venue_name"],
                    "home_multiplier": venue_multiplier,
                    "simulated_home_score": None,
                    "simulated_away_score": None,
                    "home_win_percentage": None,
                    "total_simulations": 0
                })
        
        return games_with_simulations
    finally:
        conn.close()

@app.get("/api/teams", response_model=List[Team])
async def get_teams():
    """Get all teams from the database"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name FROM teams ORDER BY name")
        teams = cursor.fetchall()
        return [{"id": team["id"], "name": team["name"]} for team in teams]
    finally:
        conn.close()

@app.get("/api/teams/{team_id}", response_model=Team)
async def get_team(team_id: int):
    """Get a specific team by ID"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name FROM teams WHERE id = ?", (team_id,))
        team = cursor.fetchone()
        if team:
            return {"id": team["id"], "name": team["name"]}
        raise HTTPException(status_code=404, detail="Team not found")
    finally:
        conn.close()

@app.post("/api/simulations/simulate-match")
async def simulate_match(simulation_request: SimulationRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Get team A simulation results
        cursor.execute("SELECT results FROM simulations WHERE team_id = ?", (simulation_request.team_a,))
        team_a_results = [row[0] for row in cursor.fetchall()]
        
        # Get team B simulation results
        cursor.execute("SELECT results FROM simulations WHERE team_id = ?", (simulation_request.team_b,))
        team_b_results = [row[0] for row in cursor.fetchall()]
        
        # Get venue data
        cursor.execute("SELECT name, home_multiplier FROM venues WHERE id = ?", (simulation_request.venue,))
        venue_data = cursor.fetchone()
        if not venue_data:
            raise HTTPException(status_code=404, detail="Venue not found")
        
        venue_name, home_multiplier = venue_data
        
        # Get team names
        cursor.execute("SELECT name FROM teams WHERE id = ?", (simulation_request.team_a,))
        team_a_name = cursor.fetchone()[0]
        
        cursor.execute("SELECT name FROM teams WHERE id = ?", (simulation_request.team_b,))
        team_b_name = cursor.fetchone()[0]
        
        # Process simulation data (Team A is home team)
        match_outcomes = []
        home_team_scores = []
        away_team_scores = []
        home_wins = 0
        total_simulations = 0
        
        for team_a_score in team_a_results:
            for team_b_score in team_b_results:
                # Apply home multiplier to team A (home team)
                adjusted_team_a = team_a_score * home_multiplier
                adjusted_team_b = team_b_score  # No multiplier for away team
                
                # Store individual team scores
                home_team_scores.append(adjusted_team_a)
                away_team_scores.append(adjusted_team_b)
                
                # Calculate total match score
                total_score = adjusted_team_a + adjusted_team_b
                match_outcomes.append(total_score)
                
                # Count home team wins
                total_simulations += 1
                if adjusted_team_a > adjusted_team_b:
                    home_wins += 1
        
        # Calculate win percentage
        home_win_percentage = (home_wins / total_simulations * 100) if total_simulations > 0 else 0
        
        # Generate histogram data for both teams
        def generate_team_histogram(scores, team_name):
            if not scores:
                return []
            
            min_score = min(scores)
            max_score = max(scores)
            
            # Create bins (10-point ranges)
            bin_size = 10
            bins = {}
            
            for score in scores:
                bin_key = int(score // bin_size) * bin_size
                bins[bin_key] = bins.get(bin_key, 0) + 1
            
            # Format for histogram
            histogram_data = []
            for i in range(int(min_score - (min_score % bin_size)), int(max_score + bin_size), bin_size):
                range_label = f"{i}-{i + bin_size - 1}"
                count = bins.get(i, 0)
                histogram_data.append({"range": range_label, "count": count, "team": team_name})
            
            return histogram_data
        
        # Generate histograms for both teams
        home_histogram = generate_team_histogram(home_team_scores, team_a_name)
        away_histogram = generate_team_histogram(away_team_scores, team_b_name)
        
        # Combine histograms for side-by-side display
        combined_histogram = []
        all_ranges = set()
        
        # Collect all ranges
        for item in home_histogram:
            all_ranges.add(item["range"])
        for item in away_histogram:
            all_ranges.add(item["range"])
        
        # Create combined data
        for range_label in sorted(all_ranges):
            home_count = next((item["count"] for item in home_histogram if item["range"] == range_label), 0)
            away_count = next((item["count"] for item in away_histogram if item["range"] == range_label), 0)
            
            combined_histogram.append({
                "range": range_label,
                "home_team": home_count,
                "away_team": away_count
            })

        return {
            "team_a": team_a_name,
            "team_b": team_b_name,
            "venue": venue_name,
            "home_multiplier": home_multiplier,
            "match_outcomes": match_outcomes,
            "histogram_data": combined_histogram,
            "home_win_percentage": round(home_win_percentage, 1),
            "total_simulations": total_simulations
        }
    finally:
        conn.close()


@app.get("/api/simulations", response_model=List[Simulation])
async def get_simulations(team_id: Optional[int] = None, limit: int = 50):
    """Get simulations with optional team filter"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        if team_id:
            query = """
                SELECT s.id, s.team_id, s.simulation_run, s.results, t.name as team_name
                FROM simulations s
                JOIN teams t ON s.team_id = t.id
                WHERE s.team_id = ?
                ORDER BY s.simulation_run
                LIMIT ?
            """
            cursor.execute(query, (team_id, limit))
        else:
            query = """
                SELECT s.id, s.team_id, s.simulation_run, s.results, t.name as team_name
                FROM simulations s
                JOIN teams t ON s.team_id = t.id
                ORDER BY t.name, s.simulation_run
                LIMIT ?
            """
            cursor.execute(query, (limit,))
        
        simulations = cursor.fetchall()
        return [
            {
                "id": sim["id"],
                "team_id": sim["team_id"],
                "simulation_run": sim["simulation_run"],
                "results": sim["results"],
                "team_name": sim["team_name"]
            }
            for sim in simulations
        ]
    finally:
        conn.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
