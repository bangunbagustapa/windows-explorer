import type { FolderService } from "../../../application/services/folder-service";
import type { FolderTreeNode, FolderChild } from "@windows-explorer/shared";
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
}
