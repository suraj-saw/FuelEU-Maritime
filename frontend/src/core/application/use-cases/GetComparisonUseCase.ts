// frontend/src/core/application/use-cases/GetComparisonUseCase.ts
import type { RouteRepositoryPort } from '../ports/RouteRepositoryPort';
import type{ Route } from '../../domain/entities/Route';

export class GetComparisonUseCase {
    private routeRepo: RouteRepositoryPort;
  constructor(routeRepo: RouteRepositoryPort) {
    this.routeRepo = routeRepo;
  }

  async execute(): Promise<{
    baseline: Route | null;
    comparison: Route[];
  }> {
    return this.routeRepo.getComparison();
  }
}