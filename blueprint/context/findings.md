# Findings

> **Generated file.** The findings ledger: review findings raised by `/audit`
> against the work in progress, each with a durable ID, severity (P0-P3), and
> status. `/implement` marks repaired findings `fixed`, a later `/audit` pass
> moves them to `closed`, and `/complete` refuses to merge while any P0 or P1
> finding is `open` or `fixed`, then archives resolved findings with the work
> and resets this file.

### F-05 [P3] open - Coding standards retain completed onboarding TODOs

**File:** `blueprint/context/coding-standards.md:6`,
`blueprint/context/coding-standards.md:80`
**Found:** 2026-08-14 by `/audit` (scope: current)
**Why it matters:** The standards still instruct the workflow to choose product
data, storage, auth, validation, and deployment decisions, but those decisions
are already documented in `blueprint/project-plan.md`. This leaves the active
coding guidance looking unfinished and can cause unnecessary planning work in a
future session.
**Suggested fix:** Replace the onboarding TODOs with the selected v1 decisions,
or remove them if the generic standards remain sufficient.
**Resolution:**
