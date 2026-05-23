# Windows Explorer Web

A Windows Explorer–like web app delivered as a Bun-workspaces monorepo.

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
VITE_API_BASE_URL=http://localhost:3000/api/v1
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

- Monorepo structure using Bun workspaces
- Openable/closable folders in left panel (Explorer-style)
- Search function for folders by name
- Custom in-house UI components
- Service + repository layering pattern
- SOLID principles applied to backend architecture
- ORM integration with Drizzle
- REST API with proper versioning, verbs, and status codes
- Built on Bun runtime
- Powered by Elysia framework
