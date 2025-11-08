// src/infrastructure/adapters/api/RouteApiAdapter.ts
import type{ RouteRepositoryPort } from '../../../core/application/ports/RouteRepositoryPort';
import type { Route } from '../../../core/domain/entities/Route';
import { apiClient } from '../../http/apiClient';

export class RouteApiAdapter implements RouteRepositoryPort {
  async getRoutes(filters?: Partial<Route>): Promise<Route[]> {
    const params = new URLSearchParams();
    if (filters?.vesselType) params.append('vesselType', filters.vesselType);
    if (filters?.fuelType) params.append('fuelType', filters.fuelType);
    if (filters?.year) params.append('year', String(filters.year));

    const { data } = await apiClient.get(`/routes?${params}`);
    return data;
  }

  async setBaseline(routeId: string): Promise<void> {
    await apiClient.post(`/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<{ baseline: Route | null; comparison: Route[] }> {
    const { data } = await apiClient.get('/routes/comparison');
    return data;
  }
}