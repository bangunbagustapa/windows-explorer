import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { db } from "../../infrastructure/db/client";
import { setupErrorHandler } from "./error-handler";
import { createFolderController } from "../../config/composition-root";

export function createApp() {
  const app = new Elysia();

  // CORS
  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
  app.use(cors({ origin: corsOrigin }));

  // Centralized error handler
  setupErrorHandler(app);

  // Health check endpoint
  app.get("/api/v1/health", async () => {
    try {
      // Test DB connection
      await db.execute("SELECT 1");
      return {
        status: "ok",
        db: "up",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "degraded",
        db: "down",
        timestamp: new Date().toISOString(),
      };
    }
  });

  // Folder tree endpoint
  const folderController = createFolderController();
  app.get("/api/v1/folders/tree", async () => {
    return folderController.getTree();
  });

  return app;
}
