import { pgTable, serial, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const folders = pgTable(
  "folders",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    parentId: integer("parent_id").references((): any => folders.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    parentIdIdx: index("folders_parent_id_idx").on(table.parentId),
    nameIdx: index("folders_name_idx").on(table.name),
  })
);

export const files = pgTable(
  "files",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    folderId: integer("folder_id")
      .notNull()
      .references(() => folders.id, { onDelete: "cascade" }),
    size: integer("size").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    folderIdIdx: index("files_folder_id_idx").on(table.folderId),
  })
);
