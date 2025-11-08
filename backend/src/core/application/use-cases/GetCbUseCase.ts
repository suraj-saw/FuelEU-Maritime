// backend/src/core/application/use-cases/GetCbUseCase.ts

import type { Compliance } from "../../domain/entities/Compliance.js";
import type { ComplianceRepositoryPort } from "../ports/ComplianceRepositoryPort.js";

export class GetCbUseCase {
  constructor(private repo: ComplianceRepositoryPort) {}
  async execute(shipId: string, year: number): Promise<Compliance | null> {
    return this.repo.getCb(shipId, year);
  }
}

export class BankSurplusUseCase {
  constructor(private repo: ComplianceRepositoryPort) {}
  async execute(shipId: string, year: number, amount: number): Promise<void> {
    return this.repo.bankSurplus(shipId, year, amount);
  }
}

export class PoolCreateUseCase {
  constructor(private repo: ComplianceRepositoryPort) {}
  async execute(year: number): Promise<string> {
    return this.repo.createPool(year);
  }
}

export class PoolAllocateUseCase {
  constructor(private repo: ComplianceRepositoryPort) {}
  async execute(
    poolId: string
  ): Promise<Array<{ shipId: string; cbAfter: number }>> {
    return this.repo.allocatePool(poolId);
  }
}
