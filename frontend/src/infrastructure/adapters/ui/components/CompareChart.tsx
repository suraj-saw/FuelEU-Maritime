// src/infrastructure/ui/components/CompareChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Route } from '../../../../core/domain/entities/Route';

const TARGET = 89.3368; // 2 % below 91.16

interface Props {
  baseline: Route | null;
  comparison: Route[];
}

export function CompareChart({ baseline, comparison }: Props) {
  const data = comparison.map(c => ({
    routeId: c.routeId,
    baseline: baseline?.ghgIntensity ?? 0,
    comparison: c.ghgIntensity,
    target: TARGET,
    diff: baseline ? ((c.ghgIntensity / baseline.ghgIntensity - 1) * 100).toFixed(2) : '0',
    compliant: c.ghgIntensity <= TARGET ? 'Yes' : 'No',
  }));

  return (
    <div className="h-96 w-full mt-6">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="routeId" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="baseline" fill="#8884d8" name="Baseline" />
          <Bar dataKey="comparison" fill="#82ca9d" name="Comparison" />
          <Bar dataKey="target" fill="#ff7300" name="Target (89.34)" />
        </BarChart>
      </ResponsiveContainer>

      {/* Comparison table below chart */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">GHG Intensity</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">% Diff</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Compliant</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(d => (
              <tr key={d.routeId}>
                <td className="px-4 py-2 text-sm">{d.routeId}</td>
                <td className="px-4 py-2 text-sm">{d.comparison.toFixed(2)}</td>
                <td className="px-4 py-2 text-sm">{d.diff}%</td>
                <td className={`px-4 py-2 text-sm font-medium ${d.compliant === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>
                  {d.compliant === 'Yes' ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}