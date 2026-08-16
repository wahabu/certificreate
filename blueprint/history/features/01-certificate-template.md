# Feature: Certificate template

**From build-plan:** feature 1
**Status:** not started

## Goal

Build the first real certificate surface as a reusable, themeable Black Border
certificate component with placeholder content and the default Traversy-style
logo mark. It establishes the visual and rendering contract that the live form
and later PNG/PDF export will reuse.

## Design reference

- [Black Border reference image](/home/ai-hibo/Documents/projects/Code/certificreate/blueprint/reference/cert-example.png)
- [Prototype theme tokens](/home/ai-hibo/Documents/projects/Code/certificreate/prototypes/theme.css)
- [Prototype screen](/home/ai-hibo/Documents/projects/Code/certificreate/prototypes/main-tool.html)

The prototype is the locked design reference for colors, typography, spacing,
certificate proportions, and app chrome direction. The reference image anchors
the certificate's border, corner flourishes, formal typography, and logo mark.

## In scope

- Port the prototype's relevant visual tokens into the app's Tailwind v4 global
  stylesheet, including app chrome and certificate colors, type stacks, spacing,
  radii, and shadows.
- Define the load-bearing certificate data and theme types needed by later form,
  template, brand-settings, and export features.
- Build a self-contained `BlackBorderCertificate` React component with a fixed
  landscape aspect ratio and CSS geometry that scales with its container.
- Render placeholder values for recipient name, course title, issue date, and
  instructor name.
- Render a deterministic circular dot logo mark when no uploaded logo exists.
- Allow the component to accept partial theme overrides while keeping the
  Black Border defaults intact.
- Replace the Next starter home page with a minimal viewable certificate screen
  so the component can be reviewed in a browser.

## Out of scope

- Editable form controls or live state updates. Feature 2 owns those.
- PNG or PDF routes, Puppeteer, font loading for server capture, and downloads.
- Template selection or additional certificate designs. Feature 5 owns those.
- Local storage, brand settings, logo upload, history, and validation.
- Long-name auto-fit, date formatting, empty states, and other input polish.
- Production deployment or Render configuration.

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff, not full files, with a short explanation.
4. The user reviews and approves before the next step begins.
5. Checkpoints are optional. `/complete` makes the feature-level commit.

## Build steps

- [x] **Step 1 - Establish certificate tokens and contracts** - port the locked
  prototype tokens into `app/globals.css` and add typed certificate draft/theme
  contracts with Black Border defaults. *Done when:* the app still passes
  `npm run lint` and `npm run build`, and the defined defaults include every
  field required by the `CertificateDraft` and `CertificateTheme` shapes in the
  project overview.
- [x] **Step 2 - Build the Black Border certificate component** - create the
  reusable certificate component and its local styles, including proportional
  border layers, corner flourishes, title hierarchy, labels, signature/date
  rules, and fallback dot mark. *Done when:* the component renders placeholder
  data from typed props, accepts partial theme overrides through CSS variables,
  preserves a 1.414:1 landscape ratio, and has no hard-coded app-shell controls
  or form behavior.
- [x] **Step 3 - Wire the reviewable home view** - replace the starter page with
  a minimal dark certificate studio view that presents the component using the
  prototype's preview framing and responsive behavior. *Done when:* `/` shows a
  readable certificate at desktop and narrow widths, the preview stays inside
  its container without overflow or text overlap, and `npm run lint` plus
  `npm run build` pass.
- [x] **Repair F-01 - Restore the Tailwind serif token mapping** - rename the
  root serif stack variable and map `font-serif` to it without self-reference.
- [x] **Repair F-02 - Improve narrow certificate readability** - rebalance the
  mobile certificate's internal spacing and type floor while preserving its
  landscape ratio and avoiding overflow.
- [x] **Repair F-03 - Remove unused Geist font loading** - keep the active
  Inter/system UI stack as the only application font setup.
- [x] **Repair F-04 - Refresh the scaffold planning note** - align `AGENTS.md`
  with the completed project planning state.

## Files / areas

- `app/globals.css` - global theme tokens and certificate font stacks.
- `app/page.tsx` - minimal first certificate view replacing starter content.
- `types/certificate.ts` - shared certificate draft, theme, and template prop
  contracts used by later features.
- `components/certificate/BlackBorderCertificate.tsx` - reusable certificate
  markup and placeholder data defaults.
- `components/certificate/BlackBorderCertificate.module.css` - certificate-only
  layout and ornamental styling.
- `app/layout.tsx` - only if metadata or root font loading must be adjusted for
  the implemented screen.

No API routes, server actions, persistence modules, or export pipeline files are
needed for this feature.

## Data / contracts

The following shapes are load-bearing for later features and should be defined
without adding persistence or validation behavior yet:

```ts
type CertificateDraft = {
  recipientName: string;
  courseTitle: string;
  issueDate: string;
  instructorName: string;
  templateId: string;
};

type CertificateTheme = {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamilySerif: string;
  fontFamilySans: string;
};
```

The Black Border component should accept a draft plus an optional
`Partial<CertificateTheme>` and optional logo source. Missing logo input always
falls back to the built-in dot mark. The initial default draft uses the
placeholder values shown in the prototype. The component should not own browser
storage or mutate incoming props.

## Testing

- No test runner is configured in `AGENTS.md`, so this feature uses build, lint,
  and browser screenshot evidence rather than adding a test framework.
- For each step, run `npm run lint` and `npm run build` after the diff is ready.
- For Step 2, inspect the rendered component at the desktop and narrow viewport
  sizes used by the prototype and confirm the certificate remains landscape,
  readable, and free of clipped content.
- For Step 3, load `/` in a browser, capture the page at desktop and mobile
  widths, and check for console errors, overflow, and text collisions.

## Notes for the AI

- This is a Next.js App Router project. Keep the certificate component free of
  hooks and browser APIs so it can later be reused by a server-side export
  renderer. Use a Client Component only when a later feature requires browser
  interactivity.
- Treat `prototypes/theme.css` as the source of truth for the visual tokens. Do
  not alter the prototype files during implementation.
- Keep the certificate itself light and print-friendly while the surrounding
  review view follows the dark app chrome from the prototype.
- Use CSS variables for themeable certificate values and percentage-based
  geometry for the border and ornaments. Do not introduce a second template
  abstraction before Feature 5.
- Preserve accessible semantics: one certificate heading, meaningful labels,
  and an informative `aria-label` for the preview. Decorative border layers and
  logo dots should not add noisy screen-reader content.
- The exact PDF page size and self-hosted production font files remain open
  decisions for the export work and must not be guessed here.

## Findings

### 01-certificate-template/F-01 [P2] closed - Tailwind serif token resolves to itself

**File:** `app/globals.css:80`
**Found:** 2026-08-14 by `/audit` (scope: current)
**Why it matters:** The original `@theme inline` declaration mapped
`--font-serif` to itself, so Tailwind's `font-serif` utility could not resolve
to the intended Georgia/Times stack.
**Suggested fix:** Map the Tailwind token to a separately named root stack
variable.
**Resolution:** Re-reviewed the repaired mapping. `--font-serif` now points to
`--font-serif-stack`, and the generated CSS contains no self-reference.

### 01-certificate-template/F-02 [P2] closed - Narrow preview typography is below a readable size

**File:** `components/certificate/BlackBorderCertificate.module.css:247`
**Found:** 2026-08-14 by `/audit` (scope: current)
**Why it matters:** The original narrow-screen overrides reduced certificate
content to an uncomfortable size, conflicting with the narrow readability
requirement.
**Suggested fix:** Preserve a readable minimum type size by rebalancing the
narrow preview's internal spacing without changing its landscape canvas.
**Resolution:** Re-reviewed the mobile rules and the 390px browser capture. The
certificate remains landscape, fully visible, and its course and footer content
now use a larger readable floor without clipping.

### 01-certificate-template/F-03 [P2] closed - Loaded Geist fonts are not used by the active type tokens

**File:** `app/layout.tsx:2-13`, `app/globals.css:4`
**Found:** 2026-08-14 by `/audit` (scope: current)
**Why it matters:** The layout downloaded and attached Geist font variables, but
the active `--font-ui` token used an Inter/system stack instead.
**Suggested fix:** Remove the unused `next/font/google` setup until the chosen
font stack is intentional, or wire the global token to the loaded Geist
variable.
**Resolution:** Removed the unused `next/font/google` Geist setup from
`app/layout.tsx`; the active Inter/system stack in `app/globals.css` remains
unchanged. A later audit confirmed no Geist references remain.

### 01-certificate-template/F-04 [P3] closed - AGENTS.md retains a stale scaffold TODO

**File:** `AGENTS.md:12`
**Found:** 2026-08-14 by `/audit` (scope: current)
**Why it matters:** The instruction said the product purpose still needed to be
filled in and the overview regenerated, although the project plan and generated
overview already contained the product definition.
**Suggested fix:** Remove the scaffold TODO or replace it with current project
context.
**Resolution:** Replaced the scaffold-only product description and removed the
stale planning TODO. `AGENTS.md` now reflects the populated project overview.
