import { createApp } from "./interfaces/http/app";
import { createFolderService } from "./config/composition-root";

// Initialize the app
const app = createApp();

// Initialize services (composition root) to verify DI graph
// Service will be used by controllers in later deliverables (D4, D5, D6)
void createFolderService();

// Start the server
const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
});
