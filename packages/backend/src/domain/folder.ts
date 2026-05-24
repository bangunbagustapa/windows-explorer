// Domain entities - pure types, zero dependencies
import type { FolderTreeNode } from "@windows-explorer/shared";

export type Folder = {
  id: number;
  name: string;
  parentId: number | null;
  createdAt: Date;
};

// Re-export from shared package for type consistency across backend and frontend
export type { FolderTreeNode };
