# Windows Explorer

A Windows Explorer–like delivered as a Bun-workspaces monorepo.

<img width="1508" height="716" alt="Screenshot 2026-05-24 at 17 21 17" src="https://github.com/user-attachments/assets/27fe6150-4f88-4b0e-a781-260ef1beef40" />

## Stack

- **Runtime**: Bun
- **Backend**: Elysia + Drizzle ORM + PostgreSQL, with service + repository layering
- **Frontend**: Vue 3 (Composition API) + Vite + Tailwind CSS v3
- **Repo**: Bun workspaces monorepo (`packages/backend`, `packages/frontend`, `packages/shared`)

## Project structure

```
.
├── packages/
│   ├── backend/   # Bun + Elysia + Drizzle backend
│   ├── frontend/  # Vue 3 + Vite + Tailwind frontend
│   └── shared/    # Shared TypeScript types between backend and frontend
├── package.json   # Root workspace config
└── tsconfig.base.json
```

## Prerequisites

- Bun >= 1.1.0
- PostgreSQL (local or remote)

## Quick start

1. Install dependencies:
   ```bash
   bun install
   ```

2. Type-check all packages:
   ```bash
   bun run typecheck
   ```

3. Run all dev servers (once implemented):
   ```bash
   bun run dev
   ```

## Scripts

- `bun run dev` — Run dev servers for all packages
- `bun run build` — Build all packages
- `bun run lint` — Lint all packages
- `bun run typecheck` — Type-check all packages
- `bun run test` — Run tests for all packages
- `bun run format` — Format code with Prettier
- `bun run format:check` — Check formatting

## Database setup

1. Configure environment variables for the backend:
   ```bash
   cd packages/backend
   cp .env.example .env
   # Edit .env with your DATABASE_URL if needed
   ```

2. Create the PostgreSQL database:
   ```bash
   bun run db:setup
   ```

3. Run database migrations:
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

4. Seed the database with sample data:
   ```bash
   bun run db:seed
   ```

## Environment variables

### Backend (`packages/backend/.env`)

Copy `.env.example` to `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/windows_explorer
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`packages/frontend/.env`)

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Development

Each package has its own scripts that can be run directly:

```bash
# Backend only
cd packages/backend
bun run dev

# Frontend only
cd packages/frontend
bun run dev
```

## Features

- **Two-panel layout**: Left panel shows complete folder tree, right panel shows direct subfolders of selected folder
- **Openable/closable folders**: Click chevron to expand/collapse folder hierarchy (Explorer-style)
- **Folder selection**: Click folder to select and view its subfolders in right panel
- **Search function**: Backend endpoint for searching folders by name with partial matching and breadcrumb paths
- **Custom in-house UI components**: Built from scratch using Tailwind CSS (no third-party UI library)
- **Service + repository layering**: Clean architecture with separation of concerns
- **SOLID principles**: Dependency inversion, single responsibility, and open/closed principles applied
- **ORM integration**: Drizzle ORM for type-safe database queries
- **REST API standards**: Versioned endpoints (`/api/v1/`), proper HTTP methods, and status codes
- **Bun runtime**: Fast JavaScript runtime for both backend and frontend
- **Elysia framework**: Modern, type-safe web framework for backend
- **Monorepo structure**: Shared TypeScript types between backend and frontend
