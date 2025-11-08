// backend/src/core/application/ports/ComplianceRepositoryPort.ts

import type { Compliance } from "../../domain/entities/Compliance.js";

export interface ComplianceRepositoryPort {
  getCb(shipId: string, year: number): Promise<Compliance | null>;
  saveCb(cb: Compliance): Promise<void>;

  getBanked(shipId: string, year: number): Promise<number>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<void>;

  createPool(year: number): Promise<string>;
  addMember(
    poolId: string,
    shipId: string,
    cbBefore: number,
    routeId: string
  ): Promise<void>;
  allocatePool(
    poolId: string
  ): Promise<Array<{ shipId: string; cbAfter: number }>>;
}
