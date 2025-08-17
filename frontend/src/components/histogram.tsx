import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { HistogramDataPoint, MatchDetails } from '../types';

interface HistogramProps {
  data: HistogramDataPoint[];
  isLoading?: boolean;
  matchDetails?: MatchDetails | null;
  hasAttemptedSimulation?: boolean;
}

export default function Histogram({ data, isLoading, matchDetails, hasAttemptedSimulation }: HistogramProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <div className="text-slate-600 font-medium">Running simulation...</div>
        </div>
      </div>
    );
  }

  if (hasAttemptedSimulation && (!data || data.length === 0)) {
    return (
      <div className="text-center py-16">
        <div className="text-slate-500 text-lg">No simulation data available</div>
        <div className="text-slate-400 text-sm mt-2">Please try running the simulation again</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null; // Don't show anything on initial load
  }

  return (
    <div className="w-full">
      {matchDetails && (
        <div className="text-center mb-8 p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl">
          <h3 className="text-2xl font-semibold mb-4 text-slate-800">
            {matchDetails.team_a} vs {matchDetails.team_b}
          </h3>
          <p className="text-slate-600 mb-4">at {matchDetails.venue}</p>
          {matchDetails.home_win_percentage !== undefined && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
              <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-medium">
                <span className="font-semibold text-emerald-700">
                  {matchDetails.team_a} (Home) Win Rate: {matchDetails.home_win_percentage}%
                </span>
              </div>
              <div className="text-slate-500">
                Based on {matchDetails.total_simulations?.toLocaleString()} simulations
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="histogram-card">
        <div className="w-full flex justify-center">
          <BarChart width={800} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="range" 
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
            <Bar 
              dataKey="home_team" 
              fill="#6366f1" 
              name={`${matchDetails?.team_a} (Home)`}
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="away_team" 
              fill="#10b981" 
              name={`${matchDetails?.team_b} (Away)`}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
