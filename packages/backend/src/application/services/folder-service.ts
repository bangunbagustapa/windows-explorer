import type { Folder, FolderTreeNode } from "../../domain/folder";
import type { FolderRepository } from "../ports/folder-repository";

// Service class - depends on repository interface (Dependency Inversion Principle)
// Knows nothing about Drizzle, SQL, or HTTP
export class FolderService {
  constructor(private readonly folderRepository: FolderRepository) {}

  async getTree(): Promise<FolderTreeNode[]> {
    const folders = await this.folderRepository.findAll();
    return this.buildTree(folders);
  }

  async getChildren(parentId: number | null): Promise<Folder[]> {
    return this.folderRepository.findChildren(parentId);
  }

  async findById(id: number): Promise<Folder | null> {
    return this.folderRepository.findById(id);
  }

  async search(query: string, limit: number): Promise<Folder[]> {
    return this.folderRepository.search(query, limit);
  }

  // Pure function - builds nested tree from flat list in O(n)
  private buildTree(folders: Folder[]): FolderTreeNode[] {
    const map = new Map<number, FolderTreeNode>();
    const roots: FolderTreeNode[] = [];

    // First pass: create all nodes
    for (const folder of folders) {
      map.set(folder.id, { id: folder.id, name: folder.name, children: [] });
    }

    // Second pass: build hierarchy
    for (const folder of folders) {
      const node = map.get(folder.id)!;
      if (folder.parentId === null) {
        roots.push(node);
      } else {
        const parent = map.get(folder.parentId);
        if (parent) {
          parent.children.push(node);
        }
      }
    }

    return roots;
  }
}
