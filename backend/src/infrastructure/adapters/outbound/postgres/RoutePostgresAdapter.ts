// backend/src/infrastructure/adapters/outbound/postgres/RoutePostgresAdapter.ts

import type { RouteRepositoryPort } from "../../../../core/application/ports/RouteRepositoryPort.js";
import type { Route } from "../../../../core/domain/entities/Route.js";
import { prisma } from "../../../shared/db.js";

export class RoutePostgresAdapter implements RouteRepositoryPort {
  async findAll(
    filters?: Partial<Pick<Route, "vesselType" | "fuelType" | "year">>
  ): Promise<Route[]> {
    // Build a Prisma‑compatible where clause – omit undefined fields
    const where: NonNullable<
      Parameters<typeof prisma.route.findMany>[0]
    >["where"] = {};

    if (filters?.vesselType) where.vesselType = filters.vesselType;
    if (filters?.fuelType) where.fuelType = filters.fuelType;
    if (filters?.year !== undefined) where.year = filters.year;

    return prisma.route.findMany({ where });
  }

  async setBaseline(routeId: string): Promise<void> {
    await prisma.$transaction([
      prisma.route.updateMany({
        where: { isBaseline: true },
        data: { isBaseline: false },
      }),
      prisma.route.update({
        where: { routeId },
        data: { isBaseline: true },
      }),
    ]);
  }

  async getComparison(): Promise<{
    baseline: Route | null;
    comparison: any[];
  }> {
    const baseline = await prisma.route.findFirst({
      where: { isBaseline: true },
    });
    if (!baseline) return { baseline: null, comparison: [] };

    const others = await prisma.route.findMany({
      where: { isBaseline: false },
    });

    const comparison = others.map((r) => {
      const percentDiff =
        ((r.ghgIntensity - baseline.ghgIntensity) / baseline.ghgIntensity) *
        100;
      return {
        ...r,
        percentDiff: Number(percentDiff.toFixed(2)),
        compliant: r.ghgIntensity <= baseline.ghgIntensity,
      };
    });

    return { baseline, comparison };
  }
}
