// backend/src/infrastructure/adapters/inbound/http/complianceController.ts

import type { Request, Response } from "express";
import { CompliancePostgresAdapter } from "../../outbound/postgres/CompliancePostgresAdapter.js";
import {
  BankSurplusUseCase,
  GetCbUseCase,
  PoolAllocateUseCase,
  PoolCreateUseCase,
} from "../../../../core/application/use-cases/GetCbUseCase.js";
import { prisma } from "../../../shared/db.js";

const repo = new CompliancePostgresAdapter();
const getCb = new GetCbUseCase(repo);
const bank = new BankSurplusUseCase(repo);
const poolCreate = new PoolCreateUseCase(repo);
const poolAllocate = new PoolAllocateUseCase(repo);

// ---------- /compliance/cb ----------
export const getCbHandler = async (req: Request, res: Response) => {
  const { shipId, year } = req.query as { shipId: string; year: string };
  if (!shipId || !year)
    return res.status(400).json({ error: "shipId & year required" });

  // Try stored CB
  const stored = await getCb.execute(shipId, Number(year));
  if (stored) return res.json(stored);

  // Compute on‑the‑fly
  const route = await prisma.route.findFirst({
    where: { routeId: shipId.replace("SHIP-", "") },
  });
  if (!route) return res.status(404).json({ error: "route not found" });

  const energyMJ = route.fuelConsumption * 41_000; // 41 000 MJ/t
  const cb = (89.3368 - route.ghgIntensity) * energyMJ; // gCO₂e

  await repo.saveCb({ shipId, year: Number(year), cbGco2eq: cb });
  res.json({ shipId, year: Number(year), cbGco2eq: cb });
};

// ---------- /banking/bank ----------
export const bankHandler = async (req: Request, res: Response) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || amount == null) {
    return res.status(400).json({ error: "shipId, year, amount required" });
  }

  const cb = await getCb.execute(shipId, Number(year));
  if (!cb || cb.cbGco2eq <= 0) {
    return res.status(400).json({ error: "no surplus to bank" });
  }

  const toBank = Math.min(cb.cbGco2eq, Number(amount));
  await bank.execute(shipId, Number(year), toBank);
  res.json({ message: "banked", amount: toBank });
};

// GET /banking/records?shipId&year
export const getBankRecordsHandler = async (req: Request, res: Response) => {
  const { shipId, year } = req.query as { shipId: string; year: string };
  if (!shipId || !year)
    return res.status(400).json({ error: "shipId & year required" });

  const amount = await repo.getBanked(shipId, Number(year));
  res.json({ shipId, year: Number(year), amount });
};

// POST /banking/apply
export const applyBankHandler = async (req: Request, res: Response) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || amount == null)
    return res.status(400).json({ error: "shipId, year, amount required" });

  const available = await repo.getBanked(shipId, Number(year));
  if (amount > available)
    return res.status(400).json({ error: "amount exceeds banked balance" });

  await repo.bankSurplus(shipId, Number(year), -Math.abs(amount));
  res.json({ message: "applied", amount });
};

// ---------- /pools ----------
export const createPoolHandler = async (req: Request, res: Response) => {
  const { year } = req.body;
  if (!year) return res.status(400).json({ error: "year required" });

  const poolId = await poolCreate.execute(Number(year));
  res.json({ poolId });
};

export const allocatePoolHandler = async (req: Request, res: Response) => {
  const { poolId } = req.body;
  if (!poolId) return res.status(400).json({ error: "poolId required" });

  const result = await poolAllocate.execute(poolId);
  res.json(result);
};

export const getAdjustedCbHandler = async (req: Request, res: Response) => {
  const { shipId, year } = req.query as { shipId: string; year: string };
  if (!shipId || !year)
    return res.status(400).json({ error: "shipId & year required" });

  const base = await getCb.execute(shipId, Number(year));
  if (!base) return res.status(404).json({ error: "no compliance record" });

  const banked = await repo.getBanked(shipId, Number(year));
  const adjusted = base.cbGco2eq + banked;

  res.json({ shipId, year: Number(year), adjustedCb: adjusted });
};
