import { initDb } from "../lib/db.js";

try {
  await initDb();
  console.log("Database schema is ready.");
} catch (error) {
  console.error("Database migration failed:", error);
  process.exitCode = 1;
}
