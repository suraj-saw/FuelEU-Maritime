// frontend/src/core/application/use-cases/SetBaselineUseCase.ts

import type { RouteRepositoryPort } from "../ports/RouteRepositoryPort";

export class SetBaselineUseCase {
  private routeRepo: RouteRepositoryPort;
  constructor(routeRepo: RouteRepositoryPort) {
    this.routeRepo = routeRepo;
  }

  async execute(routeId: string): Promise<void> {
    return this.routeRepo.setBaseline(routeId);
  }
}
