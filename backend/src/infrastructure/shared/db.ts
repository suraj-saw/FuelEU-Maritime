// backend/src/infrastructure/shared/db.ts

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
