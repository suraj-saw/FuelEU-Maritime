// backend/seed/seed.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TARGET_INTENSITY = 89.3368; // gCO₂e/MJ
const ENERGY_PER_TONNE = 41000; // MJ/t

// KPI Dataset (matches your provided table)

const routesData = [
  {
    routeId: "R001",
    vesselType: "Container",
    fuelType: "HFO",
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
  },
  {
    routeId: "R002",
    vesselType: "BulkCarrier",
    fuelType: "LNG",
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200,
  },
  {
    routeId: "R003",
    vesselType: "Tanker",
    fuelType: "MGO",
    year: 2024,
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    distance: 12500,
    totalEmissions: 4700,
  },
  {
    routeId: "R004",
    vesselType: "RoRo",
    fuelType: "HFO",
    year: 2025,
    ghgIntensity: 89.2,
    fuelConsumption: 4900,
    distance: 11800,
    totalEmissions: 4300,
  },
  {
    routeId: "R005",
    vesselType: "Container",
    fuelType: "LNG",
    year: 2025,
    ghgIntensity: 90.5,
    fuelConsumption: 4950,
    distance: 11900,
    totalEmissions: 4400,
  },
];

// SEED SCRIPT

async function main() {
  console.log("Starting database seeding...");

  // Clear existing tables
  await prisma.poolMember.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.bankEntry.deleteMany();
  await prisma.shipCompliance.deleteMany();
  await prisma.route.deleteMany();
  console.log("Cleared all tables.");

  // Insert route data
  await prisma.route.createMany({ data: routesData });
  console.log(`Inserted ${routesData.length} routes.`);

  // Set R001 as baseline route
  await prisma.route.update({
    where: { routeId: "R001" },
    data: { isBaseline: true },
  });
  console.log("R001 set as baseline route.");

  // Compute and insert compliance data
  for (const route of routesData) {
    const energyMJ = route.fuelConsumption * ENERGY_PER_TONNE;
    const cb = (TARGET_INTENSITY - route.ghgIntensity) * energyMJ; // gCO₂e difference

    await prisma.shipCompliance.create({
      data: {
        shipId: `SHIP-${route.routeId}`,
        year: route.year,
        cbGco2eq: cb,
        routeId: route.routeId,
      },
    });
  }
  console.log("Inserted ship compliance records.");

  // Create bank entries (example)
  const bankEntries = [
    { shipId: "SHIP-R001", year: 2024, amountGco2eq: 5000000, routeId: "R001" },
    { shipId: "SHIP-R002", year: 2024, amountGco2eq: 2000000, routeId: "R002" },
  ];
  await prisma.bankEntry.createMany({ data: bankEntries });
  console.log("Inserted sample bank entries.");

  // Create an example pool and members
  const pool = await prisma.pool.create({ data: { year: 2024 } });
  await prisma.poolMember.createMany({
    data: [
      {
        poolId: pool.id,
        shipId: "SHIP-R001",
        cbBefore: 2000000,
        cbAfter: 2000000,
        routeId: "R001",
      },
      {
        poolId: pool.id,
        shipId: "SHIP-R002",
        cbBefore: -1500000,
        cbAfter: -1500000,
        routeId: "R002",
      },
    ],
  });
  console.log(`Created pool (${pool.id}) with 2 members.`);

  console.log("Seeding complete!");
}

// Run the seed process
main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
