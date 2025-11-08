// backend/src/core/application/use-cases/GetRoutesUseCase.ts

import type { Route } from "../../domain/entities/Route.js";
import type { RouteRepositoryPort } from "../ports/RouteRepositoryPort.js";

export class GetRoutesUseCase {
  constructor(private repo: RouteRepositoryPort) {}

  async execute(
    filters?: Partial<Pick<Route, "vesselType" | "fuelType" | "year">>
  ): Promise<Route[]> {
    return this.repo.findAll(filters);
  }
}
