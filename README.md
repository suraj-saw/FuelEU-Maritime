# Fuel EU Compliance Dashboard

A full-stack application that calculates and manages **Fuel EU compliance metrics** for ships based on greenhouse gas (GHG) intensity and energy consumption data.  
It supports **CB (Compliance Balance)** computation, **Banking of surplus credits**, and **Pooling** among ships for compliance adjustment.

## Overview

The **Fuel EU Compliance Dashboard** enables monitoring of maritime vessel emissions against the target GHG intensity defined by the **Fuel EU regulation**.  
It provides modules for:

- Calculating compliance balance (CB) per ship and year
- Banking surplus CB for future use
- Pooling ships to balance deficits with surpluses
- Persistent data storage in **Neon PostgreSQL** using **Prisma ORM**

### Core Formulas

Target Intensity (2025): 89.3368 gCO₂e/MJ  
Energy in Scope (MJ): fuelConsumption × 41,000  
Compliance Balance: (Target − Actual) × Energy  
Positive CB → Surplus; Negative CB → Deficit

## Architecture Summary (Haxagonal Structure)

This project follows **Hexagonal Architecture (Ports and Adapters)** for modularity, separation of concerns, and testability.

### Layers Overview

| Layer | Responsibility | Example |
|-------|----------------|----------|
| **Core Domain** | Business entities and rules | `Compliance`, `Route` |
| **Application Layer** | Use-cases and service logic | `ComplianceService`, `PoolService` |
| **Ports (Interfaces)** | Define contracts between domain and infrastructure | `ComplianceRepositoryPort` |
| **Adapters (Implementations)** | Connect domain logic to infrastructure like DB or APIs | `CompliancePostgresAdapter` |
| **Infrastructure** | Database, web server, external APIs | Prisma + Express/TSX setup |

This design ensures:
- Loose coupling between components  
- Easy unit testing  
- Domain logic independent of frameworks or databases  

## Setup & Run Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fuel-eu-compliance.git
cd fuel-eu-compliance/backend
```


