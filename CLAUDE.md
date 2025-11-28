# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 weekly planner application with Supabase authentication and PostgreSQL database via Prisma ORM. The app allows users to plan their week with daily notes and tasks.

## Development Commands

```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Format code with dprint
npm run format

# Check formatting without modifying files
npm run check-format
```

## Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio
```

## MCP Servers

This project has several MCP (Model Context Protocol) servers configured for enhanced development capabilities:

### Next.js DevTools (`next-devtools`)

- **Purpose**: Provides Next.js-specific tooling and insights
- **Use when**: Working with Next.js routing, server components, or build optimization
- **Command**: `npx -y next-devtools-mcp@latest`

### Prisma Local (`Prisma-Local`)

- **Purpose**: Direct Prisma schema and database interaction
- **Use when**:
  - Modifying database schema in `prisma/schema.prisma`
  - Creating or applying migrations
  - Querying database structure
  - Generating Prisma client
- **Command**: `npx -y prisma mcp`

### Supabase (`supabase`)

- **Purpose**: Supabase project management and queries
- **Use when**:
  - Checking authentication configuration
  - Managing Supabase tables and policies
  - Debugging auth issues
  - Working with Supabase-specific features
- **Command**: `npx -y @supabase/mcp-server-supabase@latest`
- **Note**: Uses access token from environment

### MCP Usage Guidelines

- **Always prefer MCP servers** over manual CLI commands when available
- Use Prisma-Local for all database schema work instead of raw `npx prisma` commands
- Use Supabase MCP for checking project configuration and auth setup
- These servers provide context-aware assistance beyond basic CLI tools

## Architecture

### Component Organization

The project uses an atomic design pattern:

- **Atoms** (`src/app/Atoms/`): Base UI components (Button, Checkbox, InputField, SmartEditor, etc.)
- **Components** (`src/app/Components/`): Composite components that combine atoms (Homepage, WeeklyContent, TaskItem, etc.)

Each component has its own directory with a `.tsx` file and corresponding `.module.scss` file for styles.

### Path Aliases

Configured in `tsconfig.json`:

- `@assets/*` → `src/app/assets/*`
- `@components/*` → `src/app/Components/*`
- `@atoms/*` → `src/app/Atoms/*`
- `@styles/*` → `src/app/styles/*`
- `@hooks/*` → `src/hooks/*`
- `@utils/*` → `src/utils/*`
- `@app` → `src/app`

### Authentication Flow

- Uses Supabase for authentication
- Server-side auth: `@utils/supabase/server.ts` (creates server client with cookies)
- Client-side auth: `@utils/supabase/client.ts` (creates browser client)
- Root page (`src/app/page.tsx`) is protected - redirects to `/login` if not authenticated
- Auth components in `src/app/Components/auth/` (AuthForm, PasswordField)

### Responsive Design

The app has separate mobile and desktop layouts:

- Uses `useMediaQuery` hook to detect viewport size (breakpoint: 1023px)
- Mobile: `MobileNavigation` with content switching
- Desktop: `DesktopNavigation` with `Sidebar` and `DesktopContent`
- Layout logic in `src/app/Components/Homepage/page.tsx`

### Database Layer

- Prisma client generated to `node_modules/@prisma/client`
- Schema in `prisma/schema.prisma`
- Current models: Profile (id, email, displayName, timestamps)
- Uses PostgreSQL with Supabase (DATABASE_URL and DIRECT_URL required)

### Rich Text Editor

Uses BlockNote (based on ProseMirror) with Mantine styling:

- Main component: `SmartEditor.tsx`
- Custom slash menu configuration in `@utils/blocknoteSlashMenu.ts`
- Client-side only (check for `window` before rendering)

### SVG Handling

SVGs are imported as React components using `@svgr/webpack` (configured in `next.config.ts`).

## Code Style & Standards

### Formatting

- Uses **dprint** (tabs, 120 line width)
- Always run `npm run format` before committing
- ESLint: Next.js TypeScript config with core-web-vitals
- Generated files in `src/generated/**` are ignored by ESLint

### CSS/Styling Rules

- **Never use inline styling** - all styles must be in `.module.scss` files
- **CSS class names must use kebab-case**: `this-is-a-css-class-name`
- **For conditional classes**: Use `clsx` utility
- **Color management**:
  1. First check `_global.scss` for existing colors
  2. If no suitable color exists, add new color variable to `_variables.scss`
  3. Then add it to `_global.scss`
  4. Finally use it in your component
  - **Never use hardcoded colors** like `#dc2626` directly in components

### General Guidelines

- Don't create unnecessary comments
- Keep code clean and self-documenting

## Environment Variables

Required in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous/public key
- `DATABASE_URL` - PostgreSQL connection string (used by Prisma)
- `DIRECT_URL` - Direct database connection for migrations
