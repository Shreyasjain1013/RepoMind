# RepoMind

RepoMind is a web application project built with Next.js, React, and TypeScript. The current repository contains the initial app scaffold; its main page still shows the default “Your v0 generation will show here” placeholder, so product features and intended behavior are not yet represented in the code.

## Current status

- Next.js App Router application
- TypeScript and React
- Tailwind CSS 4 styling setup
- Reusable UI components based on Base UI and shadcn tooling
- Vercel Analytics included for production

## Getting started

### Requirements

- Node.js (use a version supported by Next.js 16)
- pnpm 12.3.4

### Install dependencies

```bash
pnpm install
```

### Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
pnpm build
pnpm start
```

## Available scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm build` | Build the application for production |
| `pnpm start` | Serve the production build |

## Project structure

```text
app/                  Application routes, layout, and global styles
components/ui/        Shared UI components
lib/                  Shared utilities
public/               Static assets
```

## Technology

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Lucide](https://lucide.dev/) icons
- [Vercel Analytics](https://vercel.com/docs/analytics)

## License

No license is currently included in the repository. Add a license file before distributing or accepting contributions under an open-source license.
