import type { Folder } from "../../domain/folder";

// Repository interface - owned by application layer (Dependency Inversion Principle)
// Infrastructure layer implements this interface
export interface FolderRepository {
  findAll(): Promise<Folder[]>;
  findChildren(parentId: number | null): Promise<Folder[]>;
  findById(id: number): Promise<Folder | null>;
  search(query: string, limit: number): Promise<Folder[]>;
}
