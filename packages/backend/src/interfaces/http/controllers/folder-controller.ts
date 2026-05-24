import type { FolderService } from "../../../application/services/folder-service";
import type { FolderTreeNode } from "@windows-explorer/shared";

// Folder tree controller - depends on FolderService only
// Handles HTTP translation for folder endpoints
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  async getTree(): Promise<FolderTreeNode[]> {
    return this.folderService.getTree();
  }
}
