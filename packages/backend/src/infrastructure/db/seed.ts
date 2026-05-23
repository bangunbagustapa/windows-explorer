import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { folders, files } from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/windows_explorer";

async function seed() {
  const client = postgres(connectionString);
  const db = drizzle(client);

  console.log("Clearing existing data...");
  await db.delete(files);
  await db.delete(folders);

  console.log("Seeding folders...");

  // Create a nested tree structure (4+ levels deep with branching)
  const folderMap = new Map<string, number>();

  // Level 0: Root folders
  const roots = await db
    .insert(folders)
    .values([
      { name: "Documents", parentId: null },
      { name: "Pictures", parentId: null },
      { name: "Music", parentId: null },
      { name: "Downloads", parentId: null },
    ])
    .returning();

  roots.forEach((f) => folderMap.set(f.name, f.id));

  // Level 1: Documents children
  const docsId = folderMap.get("Documents")!;
  const docsChildren = await db
    .insert(folders)
    .values([
      { name: "Work", parentId: docsId },
      { name: "Personal", parentId: docsId },
      { name: "Projects", parentId: docsId },
    ])
    .returning();

  docsChildren.forEach((f) => folderMap.set(`Documents/${f.name}`, f.id));

  // Level 2: Work children
  const workId = folderMap.get("Documents/Work")!;
  const workChildren = await db
    .insert(folders)
    .values([
      { name: "Reports", parentId: workId },
      { name: "Presentations", parentId: workId },
      { name: "Spreadsheets", parentId: workId },
    ])
    .returning();

  workChildren.forEach((f) => folderMap.set(`Documents/Work/${f.name}`, f.id));

  // Level 3: Reports children (4th level)
  const reportsId = folderMap.get("Documents/Work/Reports")!;
  const reportsChildren = await db
    .insert(folders)
    .values([
      { name: "2023", parentId: reportsId },
      { name: "2024", parentId: reportsId },
      { name: "2025", parentId: reportsId },
    ])
    .returning();

  reportsChildren.forEach((f) => folderMap.set(`Documents/Work/Reports/${f.name}`, f.id));

  // Level 2: Projects children
  const projectsId = folderMap.get("Documents/Projects")!;
  const projectsChildren = await db
    .insert(folders)
    .values([
      { name: "Web", parentId: projectsId },
      { name: "Mobile", parentId: projectsId },
      { name: "Desktop", parentId: projectsId },
    ])
    .returning();

  projectsChildren.forEach((f) => folderMap.set(`Documents/Projects/${f.name}`, f.id));

  // Level 1: Pictures children
  const picsId = folderMap.get("Pictures")!;
  const picsChildren = await db
    .insert(folders)
    .values([
      { name: "Vacation", parentId: picsId },
      { name: "Family", parentId: picsId },
      { name: "Screenshots", parentId: picsId },
    ])
    .returning();

  picsChildren.forEach((f) => folderMap.set(`Pictures/${f.name}`, f.id));

  // Level 2: Vacation children
  const vacationId = folderMap.get("Pictures/Vacation")!;
  const vacationChildren = await db
    .insert(folders)
    .values([
      { name: "Beach", parentId: vacationId },
      { name: "Mountains", parentId: vacationId },
      { name: "City", parentId: vacationId },
    ])
    .returning();

  vacationChildren.forEach((f) => folderMap.set(`Pictures/Vacation/${f.name}`, f.id));

  // Level 1: Music children
  const musicId = folderMap.get("Music")!;
  const musicChildren = await db
    .insert(folders)
    .values([
      { name: "Rock", parentId: musicId },
      { name: "Jazz", parentId: musicId },
      { name: "Classical", parentId: musicId },
    ])
    .returning();

  musicChildren.forEach((f) => folderMap.set(`Music/${f.name}`, f.id));

  // Level 2: Rock children
  const rockId = folderMap.get("Music/Rock")!;
  const rockChildren = await db
    .insert(folders)
    .values([
      { name: "Classic Rock", parentId: rockId },
      { name: "Alternative", parentId: rockId },
      { name: "Indie", parentId: rockId },
    ])
    .returning();

  rockChildren.forEach((f) => folderMap.set(`Music/Rock/${f.name}`, f.id));

  console.log("Seeding files in leaf folders...");

  // Add some files to leaf folders (folders at the deepest level)
  const leafFolders = [
    folderMap.get("Documents/Work/Reports/2023"),
    folderMap.get("Documents/Work/Reports/2024"),
    folderMap.get("Documents/Projects/Web"),
    folderMap.get("Pictures/Vacation/Beach"),
    folderMap.get("Music/Rock/Classic Rock"),
  ];

  for (const folderId of leafFolders) {
    if (!folderId) continue;
    await db.insert(files).values([
      { name: "document1.txt", folderId, size: 1024 },
      { name: "document2.txt", folderId, size: 2048 },
      { name: "notes.txt", folderId, size: 512 },
    ]);
  }

  const folderCount = await db.select().from(folders);
  const fileCount = await db.select().from(files);

  console.log(`✅ Seed complete: ${folderCount.length} folders, ${fileCount.length} files`);

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
