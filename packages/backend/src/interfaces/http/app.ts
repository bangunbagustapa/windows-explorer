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

  // Root folders endpoint
  app.get("/api/v1/folders/roots", async () => {
    return folderController.getRoots();
  });

  // Direct children endpoint
  app.get("/api/v1/folders/:id/children", async ({ params }) => {
    return folderController.getChildren(params.id);
  });

  // Search endpoint
  app.get("/api/v1/folders/search", async ({ query }) => {
    return folderController.search(query.q as string, query.limit as string);
  });

  return app;
}
