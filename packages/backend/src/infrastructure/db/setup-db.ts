import postgres from "postgres";

const sql = postgres("postgresql://postgres:postgres@localhost:5432/postgres");

async function setupDatabase() {
  try {
    // Check if database exists
    const result = await sql`
      SELECT 1 FROM pg_database WHERE datname = 'windows_explorer'
    `;

    if (result.length > 0) {
      console.log("Database 'windows_explorer' already exists");
    } else {
      // Create database
      await sql`CREATE DATABASE windows_explorer`;
      console.log("Database 'windows_explorer' created successfully");
    }
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

setupDatabase();
