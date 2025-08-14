from fastapi import FastAPI, HTTPException
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

@app.get("/api/games", response_model=List[Game])
async def get_games(venue_id: Optional[int] = None, limit: int = 50):
    """Get games with optional venue filter"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        if venue_id:
            query = """
                SELECT g.id, g.home_team, g.away_team, g.date, g.venue_id, v.name as venue_name
                FROM games g
                JOIN venues v ON g.venue_id = v.id
                WHERE g.venue_id = ?
                ORDER BY g.date
                LIMIT ?
            """
            cursor.execute(query, (venue_id, limit))
        else:
            query = """
                SELECT g.id, g.home_team, g.away_team, g.date, g.venue_id, v.name as venue_name
                FROM games g
                JOIN venues v ON g.venue_id = v.id
                ORDER BY g.date
                LIMIT ?
            """
            cursor.execute(query, (limit,))
        
        games = cursor.fetchall()
        return [
            {
                "id": game["id"],
                "home_team": game["home_team"],
                "away_team": game["away_team"],
                "date": game["date"],
                "venue_id": game["venue_id"],
                "venue_name": game["venue_name"]
            }
            for game in games
        ]
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

@app.get("/api/items", response_model=List[Item])
async def get_items():
    """Get all items"""
    return items_db

@app.post("/api/items", response_model=Item)
async def create_item(item: Item):
    """Create a new item"""
    global item_id_counter
    item.id = item_id_counter
    item_id_counter += 1
    items_db.append(item)
    return item

@app.get("/api/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    """Get a specific item by ID"""
    for item in items_db:
        if item.id == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/api/items/{item_id}")
async def delete_item(item_id: int):
    """Delete an item by ID"""
    global items_db
    for i, item in enumerate(items_db):
        if item.id == item_id:
            deleted_item = items_db.pop(i)
            return {"message": f"Item {deleted_item.name} deleted successfully"}
    raise HTTPException(status_code=404, detail="Item not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
