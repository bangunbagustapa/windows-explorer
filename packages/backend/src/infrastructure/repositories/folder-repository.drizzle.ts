import type { Folder } from "../../domain/folder";
import type { FolderRepository } from "../../application/ports/folder-repository";
import { folders } from "../db/schema";
import { db } from "../db/client";
import { eq, ilike, or, isNull } from "drizzle-orm";

// Repository implementation - only this file touches Drizzle
// Implements the interface defined in application layer (Dependency Inversion Principle)
export class FolderRepositoryDrizzle implements FolderRepository {
  async findAll(): Promise<Folder[]> {
    const result = await db.select().from(folders).orderBy(folders.name);
    return result.map((row) => ({
      id: row.id,
      name: row.name,
      parentId: row.parentId,
      createdAt: row.createdAt,
    }));
  }

  async findChildren(parentId: number | null): Promise<Folder[]> {
    const result = await db
      .select()
      .from(folders)
      .where(parentId === null ? isNull(folders.parentId) : eq(folders.parentId, parentId))
      .orderBy(folders.name);
    return result.map((row) => ({
      id: row.id,
      name: row.name,
      parentId: row.parentId,
      createdAt: row.createdAt,
    }));
  }

  async findById(id: number): Promise<Folder | null> {
    const result = await db.select().from(folders).where(eq(folders.id, id)).limit(1);
    if (result.length === 0) return null;
    const row = result[0];
    return {
      id: row.id,
      name: row.name,
      parentId: row.parentId,
      createdAt: row.createdAt,
    };
  }

  async search(query: string, limit: number): Promise<Folder[]> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return [];

    const result = await db
      .select()
      .from(folders)
      .where(
        or(
          ilike(folders.name, trimmedQuery), // exact match
          ilike(folders.name, `%${trimmedQuery}%`) // partial match
        )
      )
      .orderBy(folders.name)
      .limit(limit);
    return result.map((row) => ({
      id: row.id,
      name: row.name,
      parentId: row.parentId,
      createdAt: row.createdAt,
    }));
  }
}
