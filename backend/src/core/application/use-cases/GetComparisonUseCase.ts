// backend/src/core/application/use-cases/GetComparisonUseCase.ts

import type { Route } from "../../domain/entities/Route.js";
import type { RouteRepositoryPort } from "../ports/RouteRepositoryPort.js";

export class GetComparisonUseCase {
  constructor(private repo: RouteRepositoryPort) {}

  async execute(): Promise<{ baseline: Route | null; comparison: Route[] }> {
    return this.repo.getComparison();
  }
}
