# Feature: Form and live preview

**From build-plan:** feature 2
**Status:** complete

## Goal

Build a responsive two-column certificate studio with inputs for recipient name,
course, date, and instructor bound live to the Black Border certificate preview.
The form and preview stack on narrow screens and remain usable at the 1024px
desktop breakpoint.

## Key fix

- Apply `min-w-0` to the preview grid child/container so its default intrinsic
  minimum width cannot force horizontal overflow on 1024px screens.

## In scope

- A focused controlled form for recipient name, course title, issue date, and
  instructor name.
- Client-side draft state initialized from `DEFAULT_CERTIFICATE_DRAFT`.
- Live preview updates on every form change without submission or persistence.
- A responsive preview wrapper around the existing
  `BlackBorderCertificate`.
- A two-column studio layout on desktop that stacks on smaller screens.
- `min-w-0` on the preview grid child/container so the certificate cannot force
  horizontal CSS Grid overflow at 1024px.

## Out of scope

- Form submission, export actions, PNG/PDF generation, or server routes.
- Validation, error messages, long-name auto-fit, empty-state behavior, and date
  formatting or date-picker polish. Feature 8 owns these.
- Local storage, restoring prior values, and certificate history.
- Brand settings and an instructor default loaded from them. Feature 6a owns the
  store, so this feature uses the existing default draft value.
- Template selection, theme editing, logo upload, and additional templates.
- Changes to the Black Border certificate's visual design.

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff, not full files, with a short explanation.
4. The user reviews and approves before the next step begins.
5. Checkpoints are optional. `/complete` makes the feature-level commit.

## Build steps

- [x] **Step 1 - Build `components/studio/CertificateForm.tsx`** - add labeled,
  controlled inputs for name, course, date, and instructor using the shared
  certificate draft contract. *Done when:* the component accepts the current
  draft and a typed change callback, each input displays its matching draft
  value, edits emit the corresponding updated value, and `npm run lint` plus
  `npm run build` pass.
- [x] **Step 2 - Build `components/studio/CertificatePreview.tsx`** - wrap
  `BlackBorderCertificate` in a responsive preview surface that passes through
  the current draft and scales within available width. *Done when:* the wrapper
  preserves the certificate's landscape ratio, applies `min-w-0` at the preview
  container boundary, introduces no horizontal overflow at 1024px or narrow
  widths, and `npm run lint` plus `npm run build` pass.
- [x] **Step 3 - Build `components/studio/CertificateStudio.tsx` and update
  `app/page.tsx`** - make the studio the client state owner and replace the
  Feature 1 review shell with the responsive form/preview layout. *Done when:*
  `/` shows form and preview in two columns at 1024px and wider, stacks them
  below that breakpoint, updates every certificate field immediately while
  typing, has no page-level horizontal overflow, and `npm run lint` plus
  `npm run build` pass.

## Files / areas

- `components/studio/CertificateForm.tsx` - controlled certificate detail inputs.
- `components/studio/CertificatePreview.tsx` - responsive preview framing.
- `components/studio/CertificateStudio.tsx` - client-side draft state and studio
  composition.
- `app/page.tsx` - server route entry that renders the studio.
- `types/certificate.ts` - reuse the existing contracts; change only if a small
  shared form-update type is proven necessary during implementation.

## Data / contracts

- Reuse the load-bearing `CertificateDraft` contract from
  `types/certificate.ts`.
- `CertificateStudio` owns one `CertificateDraft` state value initialized from
  `DEFAULT_CERTIFICATE_DRAFT`.
- `CertificateForm` remains controlled and reports typed field changes upward.
- `CertificatePreview` receives the current draft and passes it to
  `BlackBorderCertificate`.
- `templateId` remains part of the draft contract but is not editable in this
  feature.
- No persistence, API, or server/client serialization contract is added.

## Testing

- No test runner is configured in `AGENTS.md`. This UI-only feature relies on
  `npm run lint`, `npm run build`, and browser evidence.
- At 1024px, verify the two-column layout fits the viewport with no horizontal
  scrollbar and the preview grid child can shrink because it has `min-w-0`.
- At a narrow mobile width, verify the form stacks above the full-width preview
  and all inputs remain usable.
- Type distinct values into all four inputs and confirm the certificate updates
  immediately with no submit action, console error, clipping, or stale field.

## Notes for the AI

- `CertificateStudio` must be a Client Component because it owns interactive
  React state. Keep `app/page.tsx`, `CertificateForm`, and `CertificatePreview`
  free of `'use client'` unless their own implementation requires it.
- Keep `BlackBorderCertificate` presentational and free of hooks or browser APIs
  so later server-side export can reuse it.
- Apply `min-w-0` to the preview grid child/container, not only to a nested
  certificate element. CSS Grid items otherwise default to `min-width: auto`
  and can overflow around 1024px.
- Use a plain text date input for the current display contract. Do not pull date
  parsing, formatting, or picker behavior forward from Feature 8.
- Preserve the existing theme defaults and certificate markup. Do not install
  shadcn/ui, Zod, a test runner, or another dependency for this feature.
