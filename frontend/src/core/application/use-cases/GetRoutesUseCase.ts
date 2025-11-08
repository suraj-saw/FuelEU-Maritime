// frontend/src/core/application/use-cases/GetRoutesUseCase.ts

import type { RouteRepositoryPort } from "../ports/RouteRepositoryPort";
import type { Route } from "../../domain/entities/Route";

export class GetRoutesUseCase {
  private routeRepo: RouteRepositoryPort;

  constructor(routeRepo: RouteRepositoryPort) {
    this.routeRepo = routeRepo;
  }

  async execute(filters?: Partial<Route>): Promise<Route[]> {
    return this.routeRepo.getRoutes(filters);
  }
}
