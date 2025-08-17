// Shared types for the Pluto Data application

/**
 * Represents a sports team with ID and name
 */
export interface Team {
  id: number;
  name: string;
}

/**
 * Represents a sports venue with home advantage multiplier
 */
export interface Venue {
  id: number;
  name: string;
  home_multiplier: number;
}

/**
 * Represents a historical game with simulation results
 */
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

/**
 * Data point for histogram chart showing score distribution
 */
export interface HistogramDataPoint {
  range: string;
  home_team: number;
  away_team: number;
}

/**
 * Details about a simulated match including teams and results
 */
export interface MatchDetails {
  team_a: string;
  team_b: string;
  venue: string;
  home_win_percentage?: number;
  total_simulations?: number;
}

/**
 * Option for dropdown menus with optional link
 */
export interface DropdownOption {
  label: string;
  value: string;
  href?: string;
}
