// Shared types for the Pluto Data application

export interface Team {
  id: number;
  name: string;
}

export interface Venue {
  id: number;
  name: string;
  home_multiplier: number;
}

export interface Game {
  home_team: string;
  away_team: string;
  venue_id: string;
  date: string;
  venue_name: string;
  home_multiplier: number;
  simulated_home_score?: number;
  simulated_away_score?: number;
  home_win_percentage?: number;
  total_simulations?: number;
}

export interface HistogramDataPoint {
  range: string;
  home_team: number;
  away_team: number;
}

export interface MatchDetails {
  team_a: string;
  team_b: string;
  venue: string;
  home_win_percentage?: number;
  total_simulations?: number;
}

export interface DropdownOption {
  label: string;
  value: string;
  href?: string;
}
