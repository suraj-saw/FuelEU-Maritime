# Reflection on Building the Fuel EU Compliance Dashboard

## What I Learned Using AI Agents

Using AI agents throughout the development of the **Fuel EU Compliance Dashboard** taught me how to collaborate effectively with AI as a coding assistant.  
I learned how to break down complex problems into smaller, structured prompts that the AI could interpret and convert into reliable, production-ready code.  
The AI helped me design the **hexagonal architecture**, structure the database schema using **Prisma ORM**, and generate consistent TypeScript code that adhered to clean design principles.  
It also clarified architectural trade-offs, such as when to use ports and adapters for modularity.  
Overall, it felt like working alongside a senior developer who could instantly generate templates, fix schema mismatches, and optimize logic for real-world scalability.

## Efficiency Gains vs Manual Coding

AI-assisted development significantly improved both **speed** and **accuracy**:

- **Time Savings:** What might have taken several days of manual coding and debugging was completed within hours.
- **Error Reduction:** The AI ensured consistency between backend models, Prisma schema, and seed data, preventing common runtime errors.
- **Learning Acceleration:** Instead of searching through multiple documentation sources, I received contextual explanations instantly — particularly valuable for understanding **Prisma relationships**, **TypeScript typing**, and **REST API structure**.

Compared to manual coding, AI made the process more **iterative and guided**, allowing me to focus on system design and testing rather than repetitive setup tasks.

## Improvements I’d Make Next Time

If I were to redo this project:

- I’d integrate **automated testing** early (e.g., Jest or Vitest) to validate compliance calculations.
- I’d set up **CI/CD pipelines** for smoother deployment to platforms like Render or Railway.
- I’d also make the **seed data dynamic**, so datasets could be imported directly from CSV or API sources instead of being hardcoded.
- Finally, I’d explore **AI-driven data validation**, where the model could analyze inconsistencies in emissions or fuel data before inserting them into the database.
