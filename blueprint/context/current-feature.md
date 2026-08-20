# Feature: PNG export with Puppeteer

**From build-plan:** feature 3
**Status:** implemented

## Goal

Add high-resolution, pixel-perfect PNG export using headless Puppeteer. The
server renders the same Black Border certificate component used by the live
preview and returns a downloadable 2828 by 2000 pixel PNG.

For this feature, pixel-perfect means deterministic server output from the same
component, draft, dimensions, and font assets as the preview. The approved font
decision is to use `next/font/google`, which downloads and self-hosts Cormorant
Garamond for certificate serif text and Montserrat for certificate sans text.

## Design reference

- [Black Border certificate reference](../reference/cert-example.png)
- The implemented `BlackBorderCertificate` and live preview are the rendering
  source of truth. Export must not duplicate or approximate their markup.

## In scope

- A dedicated `/render` page that contains only the certificate artifact and
  builds a `CertificateDraft` from search parameters.
- Deterministic certificate typography through self-hosted `next/font` assets.
- A fixed 1414 by 1000 CSS-pixel export canvas captured at
  `deviceScaleFactor: 2`.
- Full `puppeteer` in production dependencies with bundled Chromium.
- A shared browser instance, one isolated page per export, container-safe launch
  flags, and a small concurrency limit.
- A same-origin PNG export Route Handler that validates the request shape,
  renders `/render`, waits for fonts, and returns a PNG attachment.
- A dark-theme Download PNG button with pending and recoverable error states.

## Out of scope

- PDF generation. Feature 4 will reuse the browser/rendering foundation.
- Deployment, Render service creation, or remote configuration. The build plan
  calls for a separate manual Render verification after local PNG export works.
- Template selection, theme overrides, uploaded logos, and additional templates.
- Form validation and input polish beyond structural API boundary checks.
- Local history, persistence, authentication, cloud storage, and bulk export.
- Changing the Black Border certificate design.

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff, not full files, with a short explanation.
4. The user reviews and approves before the next step begins.
5. Checkpoints are optional. `/complete` makes the feature-level commit.

## Build steps

- [x] **Step 1 - Add the dedicated `/render` page route** - create
  `app/render/page.tsx` as a Server Component that awaits Next.js 16
  `searchParams`, maps supported values into the shared `CertificateDraft`, and
  renders only `BlackBorderCertificate` on a 1414 by 1000 export canvas. Load
  Cormorant Garamond and Montserrat through `next/font/google` and use their CSS
  variables in both preview and export. *Done when:* `/render` uses defaults
  when parameters are absent, supplied recipient, course, date, and instructor
  values render through the shared component, `templateId=black-border` is
  accepted while unsupported templates do not render, preview and render use
  the same self-hosted font files, no studio chrome appears, and `npm run lint`
  plus `npm run build` pass.
- [x] **Step 2 - Configure the Puppeteer server runtime** - add full
  `puppeteer` to `dependencies`, create `lib/browser.ts` with a cached browser
  promise, per-request page lifecycle support, a maximum of two concurrent
  renders, and the required container launch flags; add `.puppeteerrc.cjs` with
  the repository-local Chromium cache and ignore `/.cache/` in `.gitignore`.
  *Done when:* Chromium installs into the configured cache, repeated calls reuse
  one connected browser while pages remain isolated and close after use, no
  client bundle imports the server-only module, and `npm run lint` plus
  `npm run build` pass.
- [x] **Step 3 - Add `app/api/export-png/route.ts`** - accept a JSON
  `CertificateDraft`, reject malformed or unsupported input with a structured
  400 response, construct a fixed same-origin `/render` URL, capture its
  certificate element at 1414 by 1000 CSS pixels with
  `deviceScaleFactor: 2`, and return the bytes as an attachment. Always release
  the page in a `finally` path and return a structured 500 response if rendering
  fails. *Done when:* a valid request returns `image/png` with
  `Content-Disposition: attachment; filename="certificate.png"`, the PNG is
  exactly 2828 by 2000 pixels and contains all supplied draft values, malformed
  JSON or fields return 400, the client cannot choose an arbitrary navigation
  URL, and `npm run lint` plus `npm run build` pass.
- [x] **Step 4 - Add the Download PNG studio action** - create a focused client
  button under `components/studio/` and integrate it with the current draft in
  the preview surface. POST the draft, download the returned blob, revoke the
  temporary object URL, disable duplicate clicks while pending, and show a
  recoverable inline error without clearing the form. *Done when:* clicking
  Download PNG saves `certificate.png` with the current live values, the button
  visibly enters and leaves its pending state, a failed response leaves the
  studio usable and offers a clear retry path, no object URL leaks remain, and
  `npm run lint` plus `npm run build` pass.

## Files / areas

- `app/render/page.tsx` - certificate-only server-rendered capture target.
- `app/layout.tsx` and `types/certificate.ts` - shared self-hosted certificate
  font variables used by preview and export.
- `lib/browser.ts` - server-only shared Chromium and render concurrency control.
- `.puppeteerrc.cjs` - repository-local bundled Chromium cache configuration.
- `.gitignore` - ignore the generated Puppeteer cache.
- `package.json` and `package-lock.json` - full Puppeteer production dependency.
- `app/api/export-png/route.ts` - validated PNG export endpoint.
- `components/studio/DownloadPngButton.tsx` - client download interaction.
- `components/studio/CertificatePreview.tsx` - place the export action beside
  the live preview.

## Data / contracts

- Reuse `CertificateDraft` from `types/certificate.ts` for preview, render, and
  API payloads. Do not introduce a second export-specific draft shape.
- `/render` accepts only `recipientName`, `courseTitle`, `issueDate`,
  `instructorName`, and `templateId` search parameters. Missing direct-page
  values fall back to `DEFAULT_CERTIFICATE_DRAFT`.
- `POST /api/export-png` accepts JSON matching `CertificateDraft`. The boundary
  rejects unknown fields, checks that all five known fields are strings no
  longer than 500 UTF-16 code units, and requires `templateId` to be
  `black-border`; it does not accept a client-provided URL or launch options.
- Success response: PNG bytes with `Content-Type: image/png`,
  `Content-Disposition: attachment; filename="certificate.png"`, and
  `Cache-Control: no-store`.
- Error response: JSON `{ "error": string }` with status 400 for invalid input
  or 500 for a render failure. Internal browser details are not exposed.
- Export dimensions are load-bearing for later PDF/render work: 1414 by 1000
  CSS pixels at device scale factor 2, producing 2828 by 2000 output pixels.

## Testing

- No test runner is configured in `AGENTS.md`, so this feature relies on
  `npm run lint`, `npm run build`, direct route/API evidence, and a real
  downloaded file.
- Load `/render` with default and encoded custom search parameters. Confirm only
  the certificate appears and its text matches the supplied draft.
- POST a valid draft to `/api/export-png`, inspect response headers, save the
  output, verify its PNG signature and 2828 by 2000 dimensions, and visually
  compare it with the browser preview.
- Exercise malformed JSON, missing or non-string fields, an unsupported
  `templateId`, and a forced browser/render failure. Confirm structured status
  codes and that a page is not leaked.
- From `/`, edit all four form values, click Download PNG once and repeatedly,
  then inspect the saved file and the pending/error behavior.

## Notes for the AI

- Use the installed Next.js 16 documentation for async page `searchParams` and
  current Route Handler behavior.
- Keep `/render` and Puppeteer server-side. Mark `lib/browser.ts` with
  `server-only`, and never expose Chromium paths, launch flags, or arbitrary
  navigation through client input.
- Launch one browser lazily and reuse it. Open and close one page per job, and
  recover cleanly if the cached browser disconnects.
- Use `--no-sandbox`, `--disable-setuid-sandbox`, and
  `--disable-dev-shm-usage`. Wait for the certificate selector and
  `document.fonts.ready` before capture.
- Build the `/render` URL against the fixed loopback host and active server port
  so a forged request host cannot redirect Chromium. Encode each accepted field
  with `URLSearchParams`; do not concatenate raw values.
- Keep deployment manual and outside these build steps, as required by the
  build-plan item.
