# Coding Standards

These conventions bind the Blueprint loop to the project that exists today:
Next.js App Router, React, TypeScript, Tailwind CSS v4, and `npm`.

> TODO: After `blueprint/project-plan.md` names the product, data, auth, storage,
> and deployment choices, re-run `/overview` and refine any conventions below
> that become too generic.

## TypeScript

- Strict mode is enabled in `tsconfig.json`.
- Avoid `any`; use proper types, generics, or `unknown`.
- Define interfaces or types for component props, API payloads, form values, and
  domain models when those concepts exist.
- Use inference where it keeps code clearer, and explicit types where values
  cross module, route, or server/client boundaries.

## React

- Use functional components.
- Prefer Server Components by default.
- Use hooks only in Client Components.
- Keep components focused on one job.
- Extract reusable client logic into custom hooks only when reuse or complexity
  justifies it.

## Next.js

- This is a Next.js 16 App Router project with routes under `app/`.
- Keep `app/layout.tsx`, `app/page.tsx`, route folders, and route-local loading,
  error, and not-found files in the root `app/` directory.
- Add `'use client'` only for interactivity, hooks, browser APIs, or client-only
  libraries.
- Prefer Server Components for data reads when the data source is available on
  the server.
- Use Server Actions for straightforward form submissions and mutations once the
  project has real data writes.
- Use Route Handlers when the app needs webhooks, third-party callbacks, custom
  HTTP responses, file upload endpoints, or endpoints for non-browser clients.
- For version-specific behavior, prefer the installed package docs under
  `node_modules/next/dist/docs/` and the current project code.

## File Organization

- Routes and app shell: `app/`
- Global styles: `app/globals.css`
- Static assets: `public/`
- Shared components: `components/[feature]/ComponentName.tsx` when needed
- Shared utilities: `lib/[utility].ts` when needed
- Shared types: `types/[feature].ts` when needed
- Server Actions: `actions/[feature].ts` when needed

Do not introduce a `src/` directory unless the project deliberately migrates to
that layout.

## Naming

- Components: PascalCase (`CertificateCard.tsx`)
- Files: match the component name for component files, or use kebab-case for
  non-component modules.
- Functions and variables: camelCase.
- Constants: SCREAMING_SNAKE_CASE when truly constant and module-level.
- Types and interfaces: PascalCase with no `I` prefix.

## Styling

- Use Tailwind CSS for styling.
- Tailwind v4 is configured through CSS-first `@theme` values in
  `app/globals.css`; no `tailwind.config.js` exists.
- Prefer reusable component structure over repeated long class strings when a
  pattern appears more than twice.
- Avoid inline styles unless a runtime-calculated value cannot reasonably be
  represented with Tailwind or CSS variables.
- Respect the existing light/dark token setup in `app/globals.css`, but do not
  assume dark mode is the product default until the project plan says so.

## Data And APIs

> TODO: Pick data storage, auth, validation, and external APIs in
> `blueprint/project-plan.md`.

- Do not add an ORM, auth provider, database client, or validation library
  silently as part of unrelated work.
- Validate data at trust boundaries: form submissions, Route Handlers, Server
  Actions, imported files, and third-party callbacks.
- Keep server-only secrets and privileged clients out of Client Components.
- When user-owned data exists, scope reads and writes to the authenticated user
  or workspace on the server.

## Error Handling

- Handle expected errors close to the boundary where they occur.
- Return structured action results for Server Actions once they exist, for
  example `{ success, data, error }`.
- Show user-facing messages that are specific enough to recover from, without
  exposing secrets or internal stack traces.
- Let unexpected failures surface during development rather than hiding them
  behind generic catch blocks.

## Testing

The blueprint installs no test runner; testing is opt-in at the project level,
because the overlay can't know your stack. Adding unit testing is an explicit
setup task the AI can do through the normal workflow, either as a build-plan item
or with `/tests`. The setup should choose the stack-native runner, wire the
scripts or commands, add a small example test, and update the Commands section
of `AGENTS.md`.

When `AGENTS.md` declares a `Verify` command, treat it as the umbrella automated
gate. It combines only the checks this project actually has, in this order when
available: typecheck, tests, then build. The command does not enable an absent
test runner or replace focused evidence. It gives local work and optional CI one
exact command to run. `/ci` owns Verify and CI setup. `/tests` adds the real test
command to Verify when it already exists, but never creates CI only because
testing was configured.

**The opt-in switch is one signal: a `test` command in the Commands section of
`AGENTS.md`.** Declare one and **tests become a gate for logic-bearing steps**,
not an optional extra; leave it out and the loop verifies logic with the evidence
it already uses (run it, a screenshot, the build). Adding the runner is itself a
deliberate step, never a silent mid-step install. This is the single definition
of the switch; the skills and `ai-interaction.md` only point back here.

- **What to test (the scope rule):** pure logic where a wrong answer is possible -
  parsers, formatters, validators, id/slug builders, server actions. These have
  assertable inputs and outputs and real edge cases (empty, missing, malformed).
- **What not to test:** UI components and integration-level surfaces (render or
  export routes, anything driving a real browser or external service). Verify those
  with a screenshot and the build, not brittle unit tests.
- **The gate (when a runner is configured):** a build step that adds in-scope logic
  must ship a passing test in the same reviewable diff. The project's test command
  must be green before the step is approved, before any checkpoint commit, and
  before `/complete` merges. UI and integration-only steps are exempt and ride on
  screenshot plus build evidence.
- **When it's named:** the `/feature` spec's Testing section predicts the coverage,
  `/implement` writes the test with the step, and if a step surfaces logic the spec
  didn't foresee, add a focused test then.
- An empty suite should fail, not pass, so "no tests ran" never looks like "passed".
- Test files live next to source files (for example `feature.test.ts`).
- Run them via the project's test command (see Commands in `AGENTS.md`), not a
  hardcoded tool name.

Stack binding (swap for yours): a TypeScript app uses Vitest, `vi.mock()` for
external dependencies (Prisma, Clerk, etc.), and `vi.useFakeTimers()` for
time-dependent logic; a Python app would use pytest; a Go app `go test`.

## Browser Verification

For UI and integration behavior, prefer real browser evidence over reading the
code and assuming it works.

- If Playwright is already installed, or the Commands section of `AGENTS.md`
  declares a Playwright script, use Playwright for browser checks, screenshots,
  console-error checks, and user-flow verification.
- If Playwright is not installed, do not add it silently in the middle of an
  unrelated feature. Use the available dev server, browser screenshots, build
  output, API output, or manual verification evidence instead.
- Add Playwright only when the user asks for it, or when the current spec is
  explicitly about setting up browser automation.
- Browser evidence is especially important for flows that click, type, submit,
  navigate, download files, render complex layouts, or depend on client-side
  state.

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible

## Comments

Write code that explains itself; comment only what the code cannot say.
Over-commenting is a common AI tell, so resist it.

- Comment the **why**, not the **what**. Delete any comment that restates the code.
- No banner/header blocks, section dividers, or step-by-step narration of obvious
  code. A file does not need a comment announcing each region.
- A comment earns its place only when it captures something the code can't: a
  non-obvious decision, a gotcha or workaround, why a value is what it is, or a
  link to a spec or issue.
- Prefer self-documenting names and small functions over explanatory comments.
- Keep doc comments minimal: a one-line purpose on an exported type or function is
  plenty; don't write JSDoc that just repeats the signature.
- When in doubt, leave the comment out.

## Writing

- No em dashes (U+2014) in generated content: docs, comments, commit messages,
  READMEs, specs. They read as AI-generated.
- Use a hyphen for `term - description` separators; rephrase prose with commas,
  parentheses, or a colon. Avoid en dashes and the ellipsis character too.
