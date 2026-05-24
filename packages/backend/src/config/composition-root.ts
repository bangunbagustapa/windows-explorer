import { FolderRepositoryDrizzle } from "../infrastructure/repositories/folder-repository.drizzle";
import { FolderService } from "../application/services/folder-service";
import type { FolderRepository } from "../application/ports/folder-repository";

// Composition root - single place where concrete classes meet
// This wires the dependency graph: db → repository → service → controllers
export function createFolderService(): FolderService {
  const folderRepository: FolderRepository = new FolderRepositoryDrizzle();
  return new FolderService(folderRepository);
}
