// backend/src/core/application/ports/RouteRepositoryPort.ts

import type { Route } from "../../domain/entities/Route.js";

export interface RouteRepositoryPort {
  findAll(
    filters?: Partial<Pick<Route, "vesselType" | "fuelType" | "year">>
  ): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<{ baseline: Route | null; comparison: Route[] }>;
}
