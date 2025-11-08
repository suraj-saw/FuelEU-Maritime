// frontend/src/infrastructure/ui/components/BankingPanel.tsx

import { useState } from "react";
import { ComplianceApiAdapter } from "../../api/ComplianceApiAdapter";

const repo = new ComplianceApiAdapter();

export function BankingPanel() {
  const [shipId, setShipId] = useState("SHIP-R001");
  const [year, setYear] = useState<number>(2024);
  const [cb, setCb] = useState<number | null>(null);
  const [adjusted, setAdjusted] = useState<number | null>(null);
  const [banked, setBanked] = useState<number | null>(null);
  const [amountToBank, setAmountToBank] = useState<number>(0);
  const [amountToApply, setAmountToApply] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const cbRec = await repo.getCb(shipId, year).catch(() => null);
      setCb(cbRec?.cbGco2eq ?? null);

      const adj = await repo.getAdjustedCb(shipId, year).catch(() => null);
      setAdjusted(adj?.adjustedCb ?? null);

      const bankRec = await repo.getBanked(shipId, year).catch(() => null);
      setBanked(bankRec?.amount ?? 0);
    } catch (e: any) {
      setMessage(e?.message ?? "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const onBank = async () => {
    setMessage(null);
    try {
      if (!amountToBank || amountToBank <= 0) {
        setMessage("Enter a positive amount to bank");
        return;
      }
      await repo.bankSurplus(shipId, year, amountToBank);
      setMessage(`Banked ${amountToBank}`);
      await loadAll();
    } catch (e: any) {
      setMessage(e?.response?.data?.error ?? e?.message ?? "Error banking");
    }
  };

  const onApply = async () => {
    setMessage(null);
    try {
      if (!amountToApply || amountToApply <= 0) {
        setMessage("Enter a positive amount to apply");
        return;
      }

      const available = (await repo.getBanked(shipId, year)).amount ?? 0;
      if (amountToApply > available) {
        setMessage("Amount exceeds available banked balance");
        return;
      }
      await repo.applyBank(shipId, year, amountToApply);
      setMessage(`Applied ${amountToApply}`);
      await loadAll();
    } catch (e: any) {
      setMessage(
        e?.response?.data?.error ?? e?.message ?? "Error applying banked amount"
      );
    }
  };

  return (
    <div>
      <div className="flex gap-3 items-center mb-4">
        <input
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
          className="px-3 py-1 border rounded"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-28 px-3 py-1 border rounded"
        />
        <button
          onClick={loadAll}
          className="px-4 py-1 bg-blue-600 text-white rounded"
        >
          Load CB
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">CB (snapshot)</div>
            <div className="text-xl font-semibold">
              {cb != null ? cb.toFixed(0) : "-"}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Adjusted CB</div>
            <div className="text-xl font-semibold">
              {adjusted != null ? adjusted.toFixed(0) : "-"}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Banked Balance</div>
            <div className="text-xl font-semibold">
              {banked != null ? banked.toFixed(0) : "-"}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 border rounded">
          <h3 className="font-medium mb-2">Bank Surplus</h3>
          <div className="flex gap-2 items-center mb-2">
            <input
              type="number"
              value={amountToBank}
              onChange={(e) => setAmountToBank(Number(e.target.value))}
              className="px-3 py-1 border rounded w-40"
            />
            <button
              onClick={onBank}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Bank
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Only allowed if CB &gt; 0 (server validates)
          </div>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-medium mb-2">Apply Banked Surplus</h3>
          <div className="flex gap-2 items-center mb-2">
            <input
              type="number"
              value={amountToApply}
              onChange={(e) => setAmountToApply(Number(e.target.value))}
              className="px-3 py-1 border rounded w-40"
            />
            <button
              onClick={onApply}
              className="px-3 py-1 bg-orange-600 text-white rounded"
            >
              Apply
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Cannot apply more than available banked amount
          </div>
        </div>
      </div>

      {message && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">{message}</div>
      )}
    </div>
  );
}
