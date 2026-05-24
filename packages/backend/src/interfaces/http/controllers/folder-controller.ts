import type { FolderService } from "../../../application/services/folder-service";
import type { FolderTreeNode, FolderChild, SearchResult } from "@windows-explorer/shared";
import { NotFoundError, ValidationError } from "../error-handler";

// Folder tree controller - depends on FolderService only
// Handles HTTP translation for folder endpoints
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  async getTree(): Promise<FolderTreeNode[]> {
    return this.folderService.getTree();
  }

  async getRoots(): Promise<FolderChild[]> {
    const folders = await this.folderService.getChildren(null);
    return folders.map((f) => ({ id: f.id, name: f.name }));
  }

  async getChildren(id: string): Promise<FolderChild[]> {
    // Validate id is a positive integer
    const folderId = parseInt(id, 10);
    if (isNaN(folderId) || folderId <= 0) {
      throw new ValidationError("Invalid folder ID");
    }

    // Check if folder exists
    const folder = await this.folderService.findById(folderId);
    if (!folder) {
      throw new NotFoundError("Folder not found");
    }

    const folders = await this.folderService.getChildren(folderId);
    return folders.map((f) => ({ id: f.id, name: f.name }));
  }

  async search(query: string | undefined, limit: string | undefined = "20"): Promise<SearchResult[]> {
    // Validate query
    if (!query) {
      throw new ValidationError("Query parameter 'q' is required");
    }
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      throw new ValidationError("Query cannot be empty");
    }

    // Validate and parse limit
    const limitNum = parseInt(limit || "20", 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      throw new ValidationError("Limit must be between 1 and 50");
    }

    const results = await this.folderService.searchWithPath(trimmedQuery, limitNum);
    return results.map((r) => ({
      id: r.id,
      name: r.name,
      path: r.path,
    }));
  }
}
