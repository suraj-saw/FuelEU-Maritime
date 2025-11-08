// frontend/src/infrastructure/ui/components/RoutesTable.tsx

import type { Route } from "../../../../core/domain/entities/Route";

interface Props {
  routes: Route[];
  onSetBaseline: (id: string) => void;
}

export function RoutesTable({ routes, onSetBaseline }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Route ID
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vessel Type
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fuel Type
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GHG Intensity
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fuel (t)
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Distance (km)
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Emissions (t)
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {routes.map((r) => (
            <tr key={r.routeId} className={r.isBaseline ? "bg-green-50" : ""}>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {r.routeId}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {r.vesselType}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {r.fuelType}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">{r.year}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {r.ghgIntensity.toFixed(2)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {r.fuelConsumption.toFixed(1)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {r.distance}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {r.totalEmissions.toFixed(1)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <button
                  onClick={() => onSetBaseline(r.routeId)}
                  disabled={!!r.isBaseline}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    r.isBaseline
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {r.isBaseline ? "Baseline" : "Set Baseline"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
