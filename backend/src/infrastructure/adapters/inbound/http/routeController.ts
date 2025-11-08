// backend/src/infrastructure/adapters/inbound/http/routeController.ts

import type { Request, Response } from "express";
import { RoutePostgresAdapter } from "../../outbound/postgres/RoutePostgresAdapter.js";
import { GetRoutesUseCase } from "../../../../core/application/use-cases/GetRoutesUseCase.js";
import { SetBaselineUseCase } from "../../../../core/application/use-cases/SetBaselineUseCase.js";
import { GetComparisonUseCase } from "../../../../core/application/use-cases/GetComparisonUseCase.js";
import type { Route } from "../../../../core/domain/entities/Route.js";

// Initialise the repository & use-cases

const repo = new RoutePostgresAdapter();
const getRoutes = new GetRoutesUseCase(repo);
const setBaseline = new SetBaselineUseCase(repo);
const getComparison = new GetComparisonUseCase(repo);

// GET /api/routes

export const getRoutesHandler = async (req: Request, res: Response) => {
  const { vesselType, fuelType, year } = req.query as Record<
    "vesselType" | "fuelType" | "year",
    string | undefined
  >;

  const filters: Partial<Pick<Route, "vesselType" | "fuelType" | "year">> = {
    ...(vesselType && { vesselType }),
    ...(fuelType && { fuelType }),
    ...(year && { year: Number(year) }),
  };

  const routes = await getRoutes.execute(filters);
  res.json(routes);
};

// POST /api/routes/:routeId/baseline

export const setBaselineHandler = async (req: Request, res: Response) => {
  const routeId = req.params.routeId as string | undefined;
  if (!routeId) {
    return res.status(400).json({ error: "routeId is required" });
  }

  await setBaseline.execute(routeId);
  res.json({ success: true });
};

// GET /api/routes/comparison

export const getComparisonHandler = async (req: Request, res: Response) => {
  const data = await getComparison.execute();
  res.json(data);
};
