import sqlite3
import pandas as pd

def test_database_queries():
    """Test various database queries to verify data integrity and relationships"""
    
    conn = sqlite3.connect('plutodata.db')
    
    print("🔍 Testing Database Queries")
    print("=" * 50)
    
    # 1. Basic table information
    print("\n1. 📊 Table Information:")
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    for table in tables:
        print(f"   - {table[0]}")
    
    # 2. Count records
    print("\n2. 📈 Record Counts:")
    cursor.execute("SELECT COUNT(*) FROM teams")
    team_count = cursor.fetchone()[0]
    print(f"   - Teams: {team_count}")
    
    cursor.execute("SELECT COUNT(*) FROM simulations")
    sim_count = cursor.fetchone()[0]
    print(f"   - Simulations: {sim_count}")
    
    # 3. Show all teams
    print("\n3. 🏆 All Teams:")
    df_teams = pd.read_sql_query("SELECT * FROM teams ORDER BY id", conn)
    print(df_teams.to_string(index=False))
    
    # 4. Sample simulation data
    print("\n4. 📋 Sample Simulation Data:")
    df_sample = pd.read_sql_query("""
        SELECT t.name, s.simulation_run, s.results 
        FROM simulations s 
        JOIN teams t ON s.team_id = t.id 
        ORDER BY t.name, s.simulation_run 
        LIMIT 15
    """, conn)
    print(df_sample.to_string(index=False))
    
    # 5. Team statistics
    print("\n5. 📊 Team Statistics:")
    df_stats = pd.read_sql_query("""
        SELECT 
            t.name,
            COUNT(s.id) as total_simulations,
            AVG(s.results) as avg_results,
            MIN(s.results) as min_results,
            MAX(s.results) as max_results
        FROM teams t
        JOIN simulations s ON t.id = s.team_id
        GROUP BY t.id, t.name
        ORDER BY avg_results DESC
    """, conn)
    print(df_stats.to_string(index=False))
    
    # 6. Best performing simulation runs
    print("\n6. 🏅 Top 10 Best Results:")
    df_best = pd.read_sql_query("""
        SELECT t.name, s.simulation_run, s.results
        FROM simulations s
        JOIN teams t ON s.team_id = t.id
        ORDER BY s.results DESC
        LIMIT 10
    """, conn)
    print(df_best.to_string(index=False))
    
    # 7. Test foreign key relationship
    print("\n7. 🔗 Foreign Key Relationship Test:")
    cursor.execute("""
        SELECT COUNT(*) 
        FROM simulations s 
        LEFT JOIN teams t ON s.team_id = t.id 
        WHERE t.id IS NULL
    """)
    orphaned_records = cursor.fetchone()[0]
    print(f"   - Orphaned simulation records: {orphaned_records}")
    print(f"   - All simulations have valid team references: {'✅' if orphaned_records == 0 else '❌'}")
    
    # 8. Data validation
    print("\n8. ✅ Data Validation:")
    cursor.execute("SELECT COUNT(*) FROM simulations WHERE results < 0 OR results > 1000")
    invalid_results = cursor.fetchone()[0]
    print(f"   - Invalid results (outside 0-1000 range): {invalid_results}")
    
    cursor.execute("SELECT COUNT(*) FROM simulations WHERE simulation_run < 1 OR simulation_run > 1000")
    invalid_runs = cursor.fetchone()[0]
    print(f"   - Invalid simulation runs: {invalid_runs}")
    
    print(f"   - Data quality: {'✅ Good' if invalid_results == 0 and invalid_runs == 0 else '❌ Issues found'}")
    
    conn.close()
    print("\n🎉 Database testing complete!")

def interactive_query():
    """Allow interactive SQL queries"""
    
    conn = sqlite3.connect('plutodata.db')
    print("\n🔧 Interactive Query Mode")
    print("Enter SQL queries (type 'quit' to exit):")
    
    while True:
        try:
            query = input("\nSQL> ").strip()
            if query.lower() in ['quit', 'exit', 'q']:
                break
            if not query:
                continue
                
            df = pd.read_sql_query(query, conn)
            print(f"\nResults ({len(df)} rows):")
            print(df.to_string(index=False))
            
        except Exception as e:
            print(f"❌ Error: {e}")
    
    conn.close()

if __name__ == "__main__":
    test_database_queries()
    
    # Uncomment the line below to enable interactive mode
    # interactive_query()
