// frontend/src/ui/pages/App.tsx

import { useEffect, useState } from "react";
import { RouteApiAdapter } from "../../infrastructure/adapters/api/RouteApiAdapter";
import { GetRoutesUseCase } from "../../core/application/use-cases/GetRoutesUseCase";
import { SetBaselineUseCase } from "../../core/application/use-cases/SetBaselineUseCase";
import { GetComparisonUseCase } from "../../core/application/use-cases/GetComparisonUseCase";
import type { Route } from "../../core/domain/entities/Route";
import { FilterBar } from "../../infrastructure/adapters/ui/components/FilterBar";
import { RoutesTable } from "../../infrastructure/adapters/ui/components/RoutesTable";
import { CompareChart } from "../../infrastructure/adapters/ui/components/CompareChart";
import { BankingPanel } from "../../infrastructure/adapters/ui/components/BankingPanel";
import { PoolingPanel } from "../../infrastructure/adapters/ui/components/PoolingPanel";

// Initialise ports & use-cases
const repo = new RouteApiAdapter();
const getRoutes = new GetRoutesUseCase(repo);
const setBaseline = new SetBaselineUseCase(repo);
const getComparison = new GetComparisonUseCase(repo);

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "routes" | "compare" | "banking" | "pooling"
  >("routes");
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filters, setFilters] = useState<Partial<Route>>({});
  const [comparison, setComparison] = useState<{
    baseline: Route | null;
    comparison: Route[];
  }>({
    baseline: null,
    comparison: [],
  });

  const loadRoutes = async () => {
    const data = await getRoutes.execute(filters);
    setRoutes(data);
  };

  const loadComparison = async () => {
    const data = await getComparison.execute();
    setComparison(data);
  };

  const handleSetBaseline = async (routeId: string) => {
    await setBaseline.execute(routeId);
    await Promise.all([loadRoutes(), loadComparison()]);
  };

  // load routes when filters change or when returning to routes tab
  useEffect(() => {
    if (activeTab === "routes") loadRoutes();
  }, [filters, activeTab]);

  // load comparison when compare tab is active
  useEffect(() => {
    if (activeTab === "compare") loadComparison();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Fuel EU Compliance Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {(["routes", "compare", "banking", "pooling"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-6 py-2 font-medium capitalize transition-colors ${
                activeTab === t
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Routes Tab */}
        {activeTab === "routes" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Routes</h2>
            <FilterBar onFilter={setFilters} />
            <RoutesTable routes={routes} onSetBaseline={handleSetBaseline} />
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === "compare" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Compare vs Baseline</h2>
            {comparison.baseline ? (
              <CompareChart
                baseline={comparison.baseline}
                comparison={comparison.comparison}
              />
            ) : (
              <p className="text-gray-600">
                Select a baseline route to see comparison.
              </p>
            )}
          </div>
        )}

        {/* Banking */}
        {activeTab === "banking" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Banking</h2>
            <BankingPanel />
          </div>
        )}

        {/* Pooling */}
        {activeTab === "pooling" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Pooling</h2>
            <PoolingPanel />
          </div>
        )}
      </div>
    </div>
  );
}
