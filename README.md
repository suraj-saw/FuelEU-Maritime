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

The project follows **Hexagonal Architecture (Ports and Adapters)** for modularity and scalability.

+---------------------------+
|        Presentation       |  ← HTTP Controllers (Inbound)
|   (API Layer)             |
+------------+--------------+
             |
             ↓
+---------------------------+
|        Application        |  ← Use Cases (Business Logic)
|   (Domain Services)       |
+------------+--------------+
             |
             ↓
+---------------------------+
|         Domain            |  ← Pure Business Rules, Entities
|   (Core Logic)            |
+------------+--------------+
             |
             ↓
+---------------------------+
|      Infrastructure       |  ← Adapters (Outbound)
|   (Database, External)    |
+---------------------------+


