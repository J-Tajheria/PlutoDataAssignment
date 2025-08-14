import requests
import json

def test_venue_endpoints():
    """Test the venue endpoints"""
    
    base_url = "http://localhost:8000"
    
    print("🏟️  Testing Venue Endpoints")
    print("=" * 50)
    
    try:
        # Test 1: Get all venues
        print("\n1. 📋 Getting all venues...")
        response = requests.get(f"{base_url}/api/venues")
        if response.status_code == 200:
            venues = response.json()
            print(f"✅ Found {len(venues)} venues:")
            for venue in venues:
                print(f"   - {venue['name']} (ID: {venue['id']}, Multiplier: {venue['home_multiplier']})")
        else:
            print(f"❌ Error: {response.status_code}")
        
        # Test 2: Get specific venue
        print("\n2. 🎯 Getting venue with ID 2...")
        response = requests.get(f"{base_url}/api/venues/2")
        if response.status_code == 200:
            venue = response.json()
            print(f"✅ Venue: {venue['name']} (Multiplier: {venue['home_multiplier']})")
        else:
            print(f"❌ Error: {response.status_code}")
        
        # Test 3: Get games
        print("\n3. ⚽ Getting games...")
        response = requests.get(f"{base_url}/api/games?limit=5")
        if response.status_code == 200:
            games = response.json()
            print(f"✅ Found {len(games)} games:")
            for game in games:
                print(f"   - {game['home_team']} vs {game['away_team']} at {game['venue_name']} on {game['date']}")
        else:
            print(f"❌ Error: {response.status_code}")
        
        # Test 4: Get games for specific venue
        print("\n4. 🏟️  Getting games for venue ID 2...")
        response = requests.get(f"{base_url}/api/games?venue_id=2&limit=3")
        if response.status_code == 200:
            games = response.json()
            print(f"✅ Found {len(games)} games at venue ID 2:")
            for game in games:
                print(f"   - {game['home_team']} vs {game['away_team']} on {game['date']}")
        else:
            print(f"❌ Error: {response.status_code}")
        
        # Test 5: Get teams
        print("\n5. 🏆 Getting teams...")
        response = requests.get(f"{base_url}/api/teams")
        if response.status_code == 200:
            teams = response.json()
            print(f"✅ Found {len(teams)} teams:")
            for team in teams[:5]:  # Show first 5
                print(f"   - {team['name']} (ID: {team['id']})")
        else:
            print(f"❌ Error: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the FastAPI server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_venue_endpoints()
