// src/infrastructure/ui/components/FilterBar.tsx
import { useState } from 'react';
import type { Route } from '../../../../core/domain/entities/Route';

interface Props {
  onFilter: (filters: Partial<Route>) => void;
}

export function FilterBar({ onFilter }: Props) {
  const [vesselType, setVesselType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [year, setYear] = useState('');

  const apply = () => {
    onFilter({ vesselType: vesselType || undefined, fuelType: fuelType || undefined, year: year ? Number(year) : undefined });
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4 p-3 bg-white rounded-lg shadow-sm">
      <select
        value={vesselType}
        onChange={e => setVesselType(e.target.value)}
        className="px-3 py-1 border rounded-md text-sm"
      >
        <option value="">All Vessel Types</option>
        <option value="Container">Container</option>
        <option value="Tanker">Tanker</option>
        <option value="Bulk">Bulk</option>
      </select>

      <select
        value={fuelType}
        onChange={e => setFuelType(e.target.value)}
        className="px-3 py-1 border rounded-md text-sm"
      >
        <option value="">All Fuel Types</option>
        <option value="HFO">HFO</option>
        <option value="MGO">MGO</option>
        <option value="LNG">LNG</option>
      </select>

      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={e => setYear(e.target.value)}
        className="w-24 px-3 py-1 border rounded-md text-sm"
      />

      <button
        onClick={apply}
        className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
      >
        Apply
      </button>
    </div>
  );
}