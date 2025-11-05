# abcqwq Next.js Starter

An opinionated Next.js starter (App Router) using TypeScript, styled-components, Zod, and Tanstack Query.

## Features

- Next.js (App Router)
- TypeScript
- styled-components with SSR registry
- Tanstack Query (`@tanstack/react-query`)
- Schema validation with Zod (`zod`)
- Biome for linting/formatting and Vitest for tests

## Requirements

- Node.js >= 18

## Quick start

Install dependencies and start the dev server:

```powershell
npm install
npm run dev
```

Open http://localhost:3000

## Important scripts

The project defines several npm scripts in `package.json`:

- `dev` - start Next.js in development mode
- `build` - build the Next.js app
- `start` / `preview` - start the production server
- `test` - run unit tests (Vitest)
- `typecheck` - run `tsc --noEmit`
- `lint` - run Biome checks
- `format` - format files with Biome
- `check` - run lint and typecheck (useful for CI)

Run the combined check:

```powershell
npm run check
```

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.
