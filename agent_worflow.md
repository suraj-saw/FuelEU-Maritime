## Agents Used

- Grok (xAI): Used for initial project setup, architecture design (monorepo, Hexagonal), and iterative refinements on the backend.
- ChatGPT (GPT-5): Used for architecture planning, complex code generation (e.g., pooling logic), debugging, and refactoring.
- GitHub Copilot: Used for inline completions, syntax corrections, and generating quick boilerplate in TypeScript and Prisma.
- Cursor AI Editor: Used for real-time iteration, code browsing across the repository, and managing multi-file consistency.

## Prompts & Outputs

### Example 1 — Initial Project Setup (via Grok)

**Prompt:**

> “i am willing to work on the project. the project implements parts of Fuel EU Maritime Compliance platform. the frontend dashboard and backend APIs handling route data, compliance balance, banking and pooling. i want to use react (node.js's vite)+ TypeScript + Tailwind CSS for frontend and backend with Node.js + TypeScript + PostgreSQL (using package of node.js). for now, i have provided you a screenshot, give me procedure and codes to implement it.”

**AI Output:**

- Provided a complete step-by-step guide for a monorepo setup.
- Generated the initial Prisma schema, a backend Express server, and a frontend App.tsx with tabs.
- Outlined the Hexagonal Architecture structure.

**Result:**  
This single response bootstrapped the entire project structure, providing the foundation for both frontend and backend development.

### Example 2 — Core Architecture & Prisma Schema (via ChatGPT)

**Prompt:**

> “Help me structure a TypeScript backend using Hexagonal Architecture for a Fuel EU Compliance Dashboard, with Prisma as ORM and Neon PostgreSQL as database... also write a Prisma schema and seed.ts script that stores routes, compliance data, and pooling relationships for multiple ships.”

**AI Output:**

- Generated a clear folder hierarchy.
- Created consistent entity definitions.
- Explained how ports (ComplianceRepositoryPort) and adapters (CompliancePostgresAdapter) interact.
- Generated relational tables: Route, ShipCompliance, Pool, PoolMember, and BankEntry.

**Result:**  
This provided the core separation of concerns and the database model, which was then iteratively refined.

### Example 3 — Iterative Schema Refinement (via Grok)

**Prompt:**

> “i think you had included extra columns in routes table. [attached schema image]. modify this with changes in required files.”

**AI Output:**

- Generated a corrected schema.prisma with minimal required fields (id, routeId, year, ghgIntensity, isBaseline).
- Made fields like vesselType optional to align with seed data.
- Updated seed/seed.ts and the getCbHandler to correctly handle the new optional fields.

**Result:**  
This allowed for rapid correction of the database schema to precisely match the project specifications.

### Example 4 — Complex Business Logic (via ChatGPT)

**Prompt:**

> “Write a function to allocate compliance balances among ships in a pool, transferring surplus to cover deficits.”

**AI Output:**

- Sorted members by their compliance balance (CB) values.
- Calculated total surplus and deficits iteratively.
- Updated each PoolMember record with new cbAfter values.

**Result:**  
I manually added detailed console logs, ensured proper year matching with the routeId, and implemented error handling for empty pools.

## Validation / Corrections

Throughout the project, generated code was validated using a combination of methods:

- Manual Testing: Each generated code block was run via npm run dev and verified through backend logs and API responses (e.g., Postman).
- Prisma Validation: Schemas were validated using npx prisma validate, and data was inspected with npx prisma studio.
- Logical Validation: The accuracy of the compliance balance (CB) computation was confirmed by manually recalculating sample results using the formula (Target − Actual) × Energy.
- Iterative Debugging:
  - When agents hallucinated variable names (e.g., cbBefore mismatch) or had incorrect import paths (../../../shared/db vs ../../shared/db), manual corrections were applied.
  - TypeScript errors (e.g., Partial<Pick<...>> type mismatches) were fixed by building conditional where clauses.
  - Backend error logs like “Route not found” helped identify missing constraints, which were then fixed by adding year filters in the repository adapter.

## Observations

- **Where AI saved time:**

  - Boilerplate & Scaffolding: Generating the entire Hexagonal folder structure, TypeScript service layers, and Prisma schema in minutes instead of hours.
  - Repetitive Tasks: Avoiding trial-and-error with database migrations and writing inline boilerplate (via Copilot).
  - Debugging: Quickly identifying and fixing complex Prisma relationship constraints and TypeScript errors.
  - Concept Explanation: Getting immediate explanations for navigation patterns in Flutter or specific Node.js patterns.

- **Where AI failed or hallucinated:**

  - Inconsistency: Occasionally swapped column names (shipId vs routeId) or produced mismatched function signatures between ports and adapters.
  - Context Loss: Sometimes "forgot" constraints (like the year constraint) or optional fields mentioned earlier in the conversation, requiring re-prompting.
  - Path/Variable Mismatches: Hallucinated file paths (e.g., src/prisma instead of backend/prisma) or variable names.

- **Combined Tool Efficiency:**
  - Grok and ChatGPT were used for conceptual scaffolding, full-stack setup, and complex, multi-step logic.
  - GitHub Copilot complemented this by filling in missing syntax, completing repetitive lines, and handling small refactors inline.
  - Cursor AI provided a side-by-side chat interface, ensuring contextual debugging and consistency across multiple files.

This combination allowed for a near-continuous "REPL-like" development loop: prompt, generate code, receive feedback/errors, and prompt for a fix.

## Best Practices Followed

- Iterative Refinement: Started with broad prompts (full-stack setup) and then drilled down to fix specific files or functions.
- Human-in-the-Loop: Treated all AI as a "pair programmer." Every block of generated logic was manually reviewed, tested, and validated before being integrated.
- Error-First Debugging: Used the errors from the compiler (tsc) or runtime (npm run dev) as the next prompt for the AI to fix.
- Task-Oriented Workflow: Used Cursor’s tasks.md (as mentioned in the ChatGPT response) to break down large problems into small, goal-oriented chunks before prompting.
- Context Preservation: Referenced previous responses or re-supplied code snippets to maintain conversation continuity and ensure the AI had the correct context.
- Traceability: Logged major architectural changes and AI-generated features in Git commits for traceability.
