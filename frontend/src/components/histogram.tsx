import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

interface HistogramProps {
  data: any[];
  isLoading?: boolean;
  matchDetails?: {
    team_a: string;
    team_b: string;
    venue: string;
    home_win_percentage?: number;
    total_simulations?: number;
  };
  hasAttemptedSimulation?: boolean;
}

export default function Histogram({ data, isLoading, matchDetails, hasAttemptedSimulation }: HistogramProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">Simulating match...</div>
      </div>
    );
  }

  if (hasAttemptedSimulation && (!data || data.length === 0)) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">No simulation data available</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null; // Don't show anything on initial load
  }

  return (
    <div className="mt-6">
      {matchDetails && (
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {matchDetails.team_a} vs {matchDetails.team_b} at {matchDetails.venue}
          </h3>
          {matchDetails.home_win_percentage !== undefined && (
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">
                {matchDetails.team_a} (Home) Win Rate: {matchDetails.home_win_percentage}%
              </span>
              <span className="mx-2">•</span>
              <span>
                Based on {matchDetails.total_simulations} simulations
              </span>
            </div>
          )}
        </div>
      )}
      <BarChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="range" 
          interval={0}
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="home_team" fill="#8884d8" name={`${matchDetails?.team_a} (Home)`} />
        <Bar dataKey="away_team" fill="#82ca9d" name={`${matchDetails?.team_b} (Away)`} />
      </BarChart>
    </div>
  );
}
