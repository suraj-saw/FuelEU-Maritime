// backend/src/infrastructure/adapters/outbound/postgres/CompliancePostgresAdapter.ts

import type { ComplianceRepositoryPort } from "../../../../core/application/ports/ComplianceRepositoryPort.js";
import type { Compliance } from "../../../../core/domain/entities/Compliance.js";
import { prisma } from "../../../shared/db.js";

const TARGET_INTENSITY = 89.3368; // gCO₂e/MJ

export class CompliancePostgresAdapter implements ComplianceRepositoryPort {
  async getCb(shipId: string, year: number): Promise<Compliance | null> {
    const rec = await prisma.shipCompliance.findUnique({
      where: { shipId_year: { shipId, year } },
      include: { route: true },
    });

    if (!rec) return null;
    return { shipId, year, cbGco2eq: rec.cbGco2eq };
  }

  async saveCb(cb: Compliance): Promise<void> {
    const routeKey = cb.shipId.replace("SHIP-", "");
    const route = await prisma.route.findFirst({
      where: { routeId: routeKey, year: cb.year },
    });

    if (!route)
      throw new Error(
        `Route not found for shipId: ${cb.shipId} (year ${cb.year})`
      );

    await prisma.shipCompliance.upsert({
      where: { shipId_year: { shipId: cb.shipId, year: cb.year } },
      update: { cbGco2eq: cb.cbGco2eq },
      create: {
        shipId: cb.shipId,
        year: cb.year,
        cbGco2eq: cb.cbGco2eq,
        routeId: route.routeId,
      },
    });
  }

  async getBanked(shipId: string, year: number): Promise<number> {
    const e = await prisma.bankEntry.findUnique({
      where: { shipId_year: { shipId, year } },
    });
    return e?.amountGco2eq ?? 0;
  }

  async bankSurplus(
    shipId: string,
    year: number,
    amount: number
  ): Promise<void> {
    const routeKey = shipId.replace("SHIP-", "");
    const route = await prisma.route.findFirst({
      where: { routeId: routeKey, year },
    });

    if (!route)
      throw new Error(`Route not found for ${shipId} in year ${year}`);

    await prisma.bankEntry.upsert({
      where: { shipId_year: { shipId, year } },
      update: { amountGco2eq: { increment: amount } },
      create: {
        shipId,
        year,
        amountGco2eq: amount,
        routeId: route.routeId,
      },
    });
  }

  async createPool(year: number): Promise<string> {
    const pool = await prisma.pool.create({ data: { year } });
    console.log(`Created pool for year ${year}: ${pool.id}`);
    return pool.id;
  }

  async addMember(
    poolId: string,
    shipId: string,
    cbBefore: number,
    routeId: string,
    year?: number
  ): Promise<void> {
    const route = await prisma.route.findFirst({
      where: year ? { routeId, year } : { routeId },
    });

    if (!route) {
      console.warn(`Route ${routeId} not found for ship ${shipId}, skipping.`);
      return;
    }

    await prisma.poolMember.create({
      data: {
        poolId,
        shipId,
        cbBefore,
        cbAfter: cbBefore,
        routeId: route.routeId,
      },
    });

    console.log(
      `Added ${shipId} to pool ${poolId} (year ${route.year}) with CB: ${cbBefore}`
    );
  }

  async allocatePool(
    poolId: string
  ): Promise<Array<{ shipId: string; cbAfter: number }>> {
    let members = await prisma.poolMember.findMany({
      where: { poolId },
      orderBy: { cbBefore: "desc" },
    });

    if (members.length === 0) {
      console.warn(
        `Pool ${poolId} is empty — rebuilding from compliance data.`
      );

      const pool = await prisma.pool.findUnique({ where: { id: poolId } });
      if (!pool) throw new Error(`Pool ${poolId} not found`);

      const compliances = await prisma.shipCompliance.findMany({
        where: { year: pool.year },
      });

      for (const c of compliances) {
        const route = await prisma.route.findFirst({
          where: { routeId: c.routeId, year: pool.year },
        });

        if (route && route.year === pool.year) {
          await this.addMember(
            poolId,
            c.shipId,
            c.cbGco2eq,
            route.routeId,
            pool.year
          );
        } else {
          console.warn(
            `⚠️ Skipping ${c.shipId} — route ${c.routeId} not matching pool year ${pool.year}`
          );
        }
      }

      members = await prisma.poolMember.findMany({ where: { poolId } });
    }

    if (members.length === 0) {
      throw new Error(
        `⚠️ No members found in pool ${poolId} (even after rebuild).`
      );
    }

    // Pool allocation logic
    let surplus = 0;
    const result: Array<{ shipId: string; cbAfter: number }> = [];

    for (const m of members) {
      if (m.cbBefore >= 0) surplus += m.cbBefore;

      const needed = m.cbBefore < 0 ? -m.cbBefore : 0;
      const taken = Math.min(needed, surplus);
      if (taken > 0) {
        console.log(
          `🔁 Transferring ${taken} from surplus pool to ${m.shipId}`
        );
      }

      surplus -= taken;
      const after = m.cbBefore + taken;

      await prisma.poolMember.update({
        where: { id: m.id },
        data: { cbAfter: after },
      });

      result.push({ shipId: m.shipId, cbAfter: after });
    }

    console.log(`✅ Pool allocation complete for pool ${poolId}`);
    return result;
  }
}
