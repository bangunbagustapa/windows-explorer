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

  async searchWithPath(query: string, limit: number): Promise<Array<Folder & { path: string[] }>> {
    const folders = await this.folderRepository.search(query, limit);
    
    // Compute path for each folder by walking up the parent chain
    const results: Array<Folder & { path: string[] }> = [];
    
    for (const folder of folders) {
      const path: string[] = [];
      let current: Folder | null = folder;
      
      // Walk up the parent chain
      while (current) {
        path.unshift(current.name);
        if (current.parentId === null) break;
        current = await this.folderRepository.findById(current.parentId);
      }
      
      results.push({ ...folder, path });
    }
    
    // Sort by exact match first, then by path
    const queryLower = query.toLowerCase();
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === queryLower;
      const bExact = b.name.toLowerCase() === queryLower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.path.join('/').localeCompare(b.path.join('/'));
    });
    
    return results;
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
