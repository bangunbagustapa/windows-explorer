// Shared types between backend and frontend
// These will be populated later as we define the API contracts.

export type FolderTreeNode = {
  id: number;
  name: string;
  children: FolderTreeNode[];
};

export type FolderChild = {
  id: number;
  name: string;
};

export type SearchResult = {
  id: number;
  name: string;
  path: string[];
};
