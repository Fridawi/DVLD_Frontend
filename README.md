# DVLD Frontend Application

The web interface for the DVLD application is built with **React**, **TypeScript**, and **Vite**. It uses RTK Query for data management, TailwindCSS for styling, and an organized feature-based component structure.

## Project Structure Overview

```
src/
  api/               # API setup and RTK Query base slice
  app/               # Redux store and global configuration
  components/        # Shared/common components
  features/          # Feature folders (applications, auth, drivers, etc.)
  hooks/             # Custom React hooks
  layouts/           # Layout components like MainLayout
  pages/             # Top-level pages (NotFound, Dashboard, etc.)
  routes/            # Router configuration and guard logic
  types/             # TypeScript interfaces and enums
  utils/             # General utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm or pnpm
- Git

### Setup

1. Clone the repository:

   ```bash
   git clone <remote-repo-url>
   cd dvld
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file at the project root and set environment variables:

   ```env
   VITE_API_BASE_URL=https://your-api-endpoint
   ```

   **Do not commit this file**; it’s ignored via `.gitignore`.

4. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

|---------------------------------------------------------------------|
| Command | Description |
|--------------------|------------------------------------------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build the production bundle (`tsc -b && vite`) |
| `npm run preview` | Preview the built output locally |
| `npm run lint` | Run ESLint across the codebase |
|---------------------------------------------------------------------|

## Feature Folder Conventions

Each subfolder under `src/features` typically contains:

- An API slice file (`*ApiSlice.ts`) for server interactions
- A main page component (`*Page.tsx` or components folder)
- Related subcomponents

Example:

```text
src/features/drivers/
  DriverApiSlice.ts
  DriversPage.tsx
  components/
    DriverCard.tsx
    DriverTable.tsx
```

## Additional Configuration

- **TailwindCSS**: Configuration lives in `tailwind.config.js`. Add colors, fonts, etc. as needed.
- **ESLint**: Configured in `eslint.config.js` with TypeScript-aware rules.
- **RTK Query**: Core logic resides in `api/apiSlice.ts`; add endpoints within feature slices.

## Deployment & CI/CD

A typical CI pipeline includes:

1. `npm ci`
2. `npm run lint` (optional but recommended)
3. `npm run build`
4. Deploy the `dist/` folder to your hosting provider (Netlify, Vercel, Azure Static Web Apps, etc.)

## Notes & Best Practices

- For multiple environments (prod, staging), use `.env.production`, `.env.staging`, etc., and load them in scripts.
- Keep sensitive keys and tokens out of the repo.

## Contributing

1. Open an issue or fork the repository.
2. Create a new branch with a descriptive name.
3. Make your changes and add tests where appropriate.
4. Submit a pull request and discuss any feedback.

---

© 2026 DVLD. All rights reserved.
