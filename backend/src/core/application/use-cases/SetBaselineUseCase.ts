// backend/src/core/application/use-cases/SetBaselineUseCase.ts

import type { RouteRepositoryPort } from "../ports/RouteRepositoryPort.js";

export class SetBaselineUseCase {
  constructor(private repo: RouteRepositoryPort) {}

  async execute(routeId: string): Promise<void> {
    await this.repo.setBaseline(routeId);
  }
}
