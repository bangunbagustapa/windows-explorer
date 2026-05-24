// Domain entities - pure types, zero dependencies

export type Folder = {
  id: number;
  name: string;
  parentId: number | null;
  createdAt: Date;
};

export type FolderTreeNode = {
  id: number;
  name: string;
  children: FolderTreeNode[];
};
