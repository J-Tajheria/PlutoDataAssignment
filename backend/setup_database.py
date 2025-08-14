import sqlite3
import csv
import os

def create_database():
    """Create the SQLite database and tables"""
    
    # Connect to database (creates it if it doesn't exist)
    conn = sqlite3.connect('plutodata.db')
    cursor = conn.cursor()
    
    print("🔧 Creating database tables...")
    
    # Create teams table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        )
    ''')
    
    # Create venues table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS venues (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            home_multiplier REAL NOT NULL
        )
    ''')
    
    # Create simulations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS simulations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_id INTEGER NOT NULL,
            simulation_run INTEGER NOT NULL,
            results INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (team_id) REFERENCES teams (id)
        )
    ''')
    
    # Create games table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            home_team TEXT NOT NULL,
            away_team TEXT NOT NULL,
            date TEXT NOT NULL,
            venue_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (venue_id) REFERENCES venues (id)
        )
    ''')
    
    print("✅ Database tables created successfully!")
    
    # Load CSV data
    load_all_csv_data(cursor)
    
    # Commit changes and close connection
    conn.commit()
    conn.close()
    print("🎉 Database setup complete!")

def load_all_csv_data(cursor):
    """Load data from all CSV files into database"""
    
    # Load teams and simulations
    csv_path = '../data/simulations.csv'
    if os.path.exists(csv_path):
        print("📊 Loading teams and simulations data...")
        load_simulations_data(cursor, csv_path)
    else:
        print(f"⚠️  Simulations CSV file not found at {csv_path}")
    
    # Load venues
    venues_path = '../data/venues.csv'
    if os.path.exists(venues_path):
        print("🏟️  Loading venues data...")
        load_venues_data(cursor, venues_path)
    else:
        print(f"⚠️  Venues CSV file not found at {venues_path}")
    
    # Load games
    games_path = '../data/games.csv'
    if os.path.exists(games_path):
        print("⚽ Loading games data...")
        load_games_data(cursor, games_path)
    else:
        print(f"⚠️  Games CSV file not found at {games_path}")

def load_simulations_data(cursor, csv_path):
    """Load teams and simulations from CSV"""
    
    teams_added = set()
    
    with open(csv_path, 'r') as file:
        csv_reader = csv.DictReader(file)
        
        for row in csv_reader:
            team_id = int(row['team_id'])
            team_name = row['team']
            simulation_run = int(row['simulation_run'])
            results = int(row['results'])
            
            # Add team if not already added
            if team_id not in teams_added:
                cursor.execute(
                    'INSERT OR IGNORE INTO teams (id, name) VALUES (?, ?)',
                    (team_id, team_name)
                )
                teams_added.add(team_id)
            
            # Add simulation record
            cursor.execute(
                'INSERT INTO simulations (team_id, simulation_run, results) VALUES (?, ?, ?)',
                (team_id, simulation_run, results)
            )
    
    print(f"✅ Loaded {len(teams_added)} teams and simulation data")

def load_venues_data(cursor, csv_path):
    """Load venues from CSV"""
    
    with open(csv_path, 'r') as file:
        csv_reader = csv.DictReader(file)
        
        for row in csv_reader:
            venue_id = int(row['venue_id'])
            venue_name = row['venue_name']
            home_multiplier = float(row['home_multiplier'])
            
            cursor.execute(
                'INSERT OR IGNORE INTO venues (id, name, home_multiplier) VALUES (?, ?, ?)',
                (venue_id, venue_name, home_multiplier)
            )
    
    print("✅ Venues data loaded")

def load_games_data(cursor, csv_path):
    """Load games from CSV"""
    
    with open(csv_path, 'r') as file:
        csv_reader = csv.DictReader(file)
        
        for row in csv_reader:
            home_team = row['home_team']
            away_team = row['away_team']
            date = row['date']
            venue_id = int(row['venue_id'])
            
            cursor.execute(
                'INSERT INTO games (home_team, away_team, date, venue_id) VALUES (?, ?, ?, ?)',
                (home_team, away_team, date, venue_id)
            )
    
    print("✅ Games data loaded")

def test_database():
    """Test the database by running some queries"""
    
    conn = sqlite3.connect('plutodata.db')
    cursor = conn.cursor()
    
    print("\n🧪 Testing database...")
    
    # Count records
    cursor.execute('SELECT COUNT(*) FROM teams')
    team_count = cursor.fetchone()[0]
    print(f"📈 Total teams: {team_count}")
    
    cursor.execute('SELECT COUNT(*) FROM venues')
    venue_count = cursor.fetchone()[0]
    print(f"🏟️  Total venues: {venue_count}")
    
    cursor.execute('SELECT COUNT(*) FROM simulations')
    sim_count = cursor.fetchone()[0]
    print(f"📊 Total simulations: {sim_count}")
    
    cursor.execute('SELECT COUNT(*) FROM games')
    game_count = cursor.fetchone()[0]
    print(f"⚽ Total games: {game_count}")
    
    # Show sample venues
    print("\n🏟️  Sample venues:")
    cursor.execute('SELECT * FROM venues ORDER BY id LIMIT 5')
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]} (multiplier: {row[2]})")
    
    # Show sample games with venue info
    print("\n⚽ Sample games with venues:")
    cursor.execute('''
        SELECT g.home_team, g.away_team, g.date, v.name as venue_name
        FROM games g
        JOIN venues v ON g.venue_id = v.id
        ORDER BY g.date
        LIMIT 5
    ''')
    
    for row in cursor.fetchall():
        print(f"  {row[0]} vs {row[1]} on {row[2]} at {row[3]}")
    
    conn.close()

if __name__ == "__main__":
    create_database()
    test_database()
