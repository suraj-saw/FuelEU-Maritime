// frontend/src/core/application/ports/RouteRepositoryPort.ts
import type { Route } from "../../domain/entities/Route";

export interface RouteRepositoryPort {
  getRoutes(filters?: Partial<Route>): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<{
    baseline: Route | null;
    comparison: Route[];
  }>;
}
