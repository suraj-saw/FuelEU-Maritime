// backend/src/index.ts

import express from "express";
import cors from "cors";
import {
  getRoutesHandler,
  setBaselineHandler,
  getComparisonHandler,
} from "./infrastructure/adapters/inbound/http/routeController.js";
import {
  getCbHandler,
  bankHandler,
  createPoolHandler,
  allocatePoolHandler,
  getAdjustedCbHandler,
  getBankRecordsHandler,
  applyBankHandler,
} from "./infrastructure/adapters/inbound/http/complianceController.js";

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/", (req, res) => res.json({ message: "Fuel EU API alive" }));

// ---- existing routes ----
app.get("/api/routes", getRoutesHandler);
app.post("/api/routes/:routeId/baseline", setBaselineHandler);
app.get("/api/routes/comparison", getComparisonHandler);

// ---- compliance ----
app.get("/compliance/cb", getCbHandler);
app.get("/compliance/adjusted-cb", getAdjustedCbHandler);
app.post("/banking/bank", bankHandler);
app.get("/banking/records", getBankRecordsHandler);
app.post("/banking/apply", applyBankHandler);
app.post("/pools", createPoolHandler);
app.post("/pools/allocate", allocatePoolHandler);

const PORT = 5000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
