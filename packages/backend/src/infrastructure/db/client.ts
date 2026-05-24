import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/windows_explorer";

// Singleton client for the application
const client = postgres(connectionString);
export const db = drizzle(client);
