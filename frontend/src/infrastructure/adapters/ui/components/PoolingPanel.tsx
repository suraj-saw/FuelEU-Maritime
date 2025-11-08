// frontend/src/infrastructure/ui/components/PoolingPanel.tsx
import { useEffect, useState } from "react";
import { ComplianceApiAdapter } from "../../api/ComplianceApiAdapter";
import { apiClient } from "../../../http/apiClient";

const repo = new ComplianceApiAdapter();

interface Member {
  routeId: string;
  shipId: string;
  cbBefore: number;
  cbAfter?: number;
}

export function PoolingPanel() {
  const [year, setYear] = useState<number>(2024);
  const [members, setMembers] = useState<Member[]>([]);
  const [poolId, setPoolId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMembers([]);
    setPoolId(null);
    setMessage(null);
  }, [year]);

  const fetchAdjustedForYear = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // fetch routes via api client (routes are under /api/routes)
      const { data: routes } = await apiClient.get("/routes", {
        params: { year },
      });

      // for each route compute adjusted CB via backend
      const tmp: Member[] = [];
      for (const r of routes) {
        const shipId = `SHIP-${r.routeId}`;
        try {
          const adj = await repo.getAdjustedCb(shipId, year);
          tmp.push({ routeId: r.routeId, shipId, cbBefore: adj.adjustedCb });
        } catch {
          // fallback to computing cb if unavailable
          const cbRec = await repo.getCb(shipId, year).catch(() => null);
          tmp.push({
            routeId: r.routeId,
            shipId,
            cbBefore: cbRec?.cbGco2eq ?? 0,
          });
        }
      }
      setMembers(tmp);
    } catch (e: any) {
      setMessage("Failed to fetch routes / adjusted CBs");
    } finally {
      setLoading(false);
    }
  };

  const createPool = async () => {
    setMessage(null);
    try {
      const sum = members.reduce((s, m) => s + m.cbBefore, 0);
      if (sum < 0) {
        setMessage("Sum of adjusted CB is negative — cannot create pool.");
        return;
      }
      const { poolId } = await repo.createPool(year);
      setPoolId(poolId);

      // add members to pool on server
      for (const m of members) {
        await apiClient
          .post("/pools/members", {
            poolId,
            shipId: m.shipId,
            cbBefore: m.cbBefore,
            routeId: m.routeId,
          })
          .catch(() => {});
      }

      // ask backend to allocate
      const allocation = await repo.allocatePool(poolId);
      const updated = members.map((m) => {
        const found = allocation.find((a: any) => a.shipId === m.shipId);
        return { ...m, cbAfter: found ? found.cbAfter : m.cbBefore };
      });
      setMembers(updated);
      setMessage("Pool created and allocated.");
    } catch (e: any) {
      setMessage(
        e?.response?.data?.error ?? e?.message ?? "Failed to create pool"
      );
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-3 py-1 w-28 border rounded"
        />
        <button
          onClick={fetchAdjustedForYear}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Fetch adjusted CBs
        </button>
        <button
          onClick={createPool}
          className="px-3 py-1 bg-green-600 text-white rounded"
          disabled={members.length === 0}
        >
          Create & Allocate Pool
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 mb-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Route</th>
                <th className="px-4 py-2 text-left">Ship</th>
                <th className="px-4 py-2 text-left">CB Before</th>
                <th className="px-4 py-2 text-left">CB After</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((m) => (
                <tr key={m.shipId}>
                  <td className="px-4 py-2">{m.routeId}</td>
                  <td className="px-4 py-2">{m.shipId}</td>
                  <td
                    className={`px-4 py-2 ${
                      m.cbBefore >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {m.cbBefore.toFixed(0)}
                  </td>
                  <td className="px-4 py-2">
                    {m.cbAfter != null ? m.cbAfter.toFixed(0) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {poolId && (
        <div className="mb-4 text-sm">
          Pool ID: <strong>{poolId}</strong>
        </div>
      )}

      {message && <div className="p-3 bg-gray-100 rounded">{message}</div>}
    </div>
  );
}
