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

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a .env file in /backend directory
```bash
DATABASE_URL="postgresql://<user>:<password>@<neon-host>/<database>?sslmode=require"
```

### 4. Apply Database Schema
```bash
npx prisma migrate reset --force
npx prisma generate
```

### 5. Seed the Database
```bash
npm run seed
```

### 6. Run the Server
```bash
npm run dev
```
Server will start at http://localhost:5000

## How to Execute Tests
You can test different modules via the frontend dashboard or directly through backend APIs.

### Functional Tests
1. Banking
- Navigate to Banking tab.  
- Enter Ship ID and Year.  
- Click Load CB → Verify snapshot and adjusted CB.
- Use Bank to store surplus CB.

2. Pooling
- Navigate to Pooling tab.  
- Click Fetch Adjusted CBs → Displays all ships’ CBs for the selected year.  
- Click Create & Allocate Pool → Redistributes surpluses among deficits.
- Check the CB After column or backend logs for allocations.
  
3. Database Verification
You can verify your data directly in the database using Prisma Studio:
```bash
npx prisma studio
```

## Screenshots & Sample Outputs

1. Routes Tab
<img width="1609" height="667" alt="image" src="https://github.com/user-attachments/assets/f446d95c-ba76-4374-b597-7223c4beb049" />

2. Compare Tab
<img width="1289" height="803" alt="image" src="https://github.com/user-attachments/assets/da39893a-644f-4a93-8c45-0273622423f9" />

3. Banking Tab
<img width="1286" height="517" alt="image" src="https://github.com/user-attachments/assets/5df430ef-8177-45f0-8f53-a0dd8e2bfe7d" />

4. Pooling Tab
<img width="1290" height="508" alt="image" src="https://github.com/user-attachments/assets/e9b910e9-838e-43ca-9011-b6d9210472ca" />
