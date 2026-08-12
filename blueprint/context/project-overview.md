# Project Overview

> **Generated file. Don't hand-edit.** Generated from
> [../project-plan.md](../project-plan.md) and
> [../build-plan.md](../build-plan.md). Re-run `/overview` or `$overview` when
> either plan changes.

## Product

**Certificreate** turns certificate details into a polished, on-brand certificate
and exports a high-quality PNG plus a print-ready PDF.

The v1 problem is narrow and practical: course-completion certificates are
currently recreated by hand in Canva, which makes each certificate slow to
produce, easy to mistype, and difficult to hand off or automate. The app should
turn recipient name, course or achievement title, date, and instructor into an
accurate certificate in seconds.

## Users

- Primary: Brad and Traversy Media, issuing certificates to students who finish
  a course.
- Secondary product direction: course creators, bootcamps, workshop hosts, and
  event organizers who need branded certificates without a designer or Canva.
- Later: students self-serving their own certificate after completing a course.

## Scope

v1 is a local-first, single-certificate tool.

- No login.
- No server-side database.
- Browser local storage holds user-kept data.
- PNG and PDF files are generated on demand and downloaded, not stored.
- The export API uses server-side rendering through Puppeteer, but persisted app
  data remains local in v1.

Later SaaS ideas such as accounts, cloud sync, public verification links, CSV
bulk generation, billing, and paid plans are explicitly out of v1.

## Build Order

| Item | Feature | Purpose |
| --- | --- | --- |
| 1 | Certificate template | Recreate the "Black Border" certificate as a self-contained, themeable HTML/CSS component with placeholder data and logo mark. |
| 2 | Form + live preview | Add recipient, course, date, and instructor inputs bound to the template so the browser preview updates live. |
| 3 | PNG export | Add a server route that renders the same template through Puppeteer and returns a high-resolution PNG. |
| 4 | PDF export | Reuse the render pipeline to output a print-ready landscape PDF with correct page size and margins. |
| 5 | Template/style system | Add a few templates that share one CSS-variable theme and a picker for switching templates. |
| 6a | Instructor + colors | Add local brand settings for instructor name and colors, then apply overrides to preview and export. |
| 6b | Logo upload | Store a logo data URL in local brand settings and render it in preview and export. |
| 7 | Certificate history | Save generated certificate metadata locally, let users reopen and re-download certificates, and remember last form values. |
| 8 | Input polish | Improve date input and formatting, validation, long-name auto-fit, and empty states. |
| 9 | Production hardening on Render | Tune Render instance sizing, render queue behavior, environment config, and custom domain after the core flow is deployed. |

## Data Model

### CertificateDraft

Current form state for the certificate being previewed or exported.

| Field | Type | Notes |
| --- | --- | --- |
| `recipientName` | `string` | Required for final export. |
| `courseTitle` | `string` | Course or achievement title. |
| `issueDate` | `string` | User-entered date, later formatted for the certificate. |
| `instructorName` | `string` | Defaults from brand settings, editable per certificate. |
| `templateId` | `string` | References a static template definition. |

### TemplateDefinition

Static, code-owned template metadata and rendering configuration.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | Stable template identifier. |
| `displayName` | `string` | Shown in the template picker. |
| `theme` | `CertificateTheme` | Default CSS-variable values for the template. |
| `render` | component/function | Produces the certificate HTML/CSS used by preview and export. |
| `assets` | object | Logo mark and any template-owned decorative assets. |

### CertificateTheme

Theme values shared by templates and brand overrides.

| Field | Type | Notes |
| --- | --- | --- |
| `primaryColor` | `string` | Main brand color, used by the border and accents. |
| `accentColor` | `string` | Secondary color when a template supports it. |
| `textColor` | `string` | Certificate text color. |
| `backgroundColor` | `string` | Certificate artifact background. |
| `fontFamilySerif` | `string` | Self-hosted serif font for the certificate. |
| `fontFamilySans` | `string` | Supporting label/UI font when needed. |

### BrandSettings

Stored in browser local storage per device.

| Field | Type | Notes |
| --- | --- | --- |
| `logoDataUrl` | `string or null` | Uploaded logo as a data URL; replaces the placeholder mark. |
| `instructorName` | `string` | Default signatory/instructor name. |
| `colors` | `Partial<CertificateTheme>` | User-selected overrides applied to templates. |
| `updatedAt` | `string` | ISO timestamp for local state maintenance. |

### CertificateHistoryEntry

Stored in browser local storage per device.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | Locally generated id. |
| `recipientName` | `string` | Recipient at generation time. |
| `courseTitle` | `string` | Course or achievement at generation time. |
| `issueDate` | `string` | Date at generation time. |
| `instructorName` | `string` | Instructor at generation time. |
| `templateId` | `string` | Template used for generation. |
| `brandSnapshot` | `BrandSettings` | Settings used for re-open and re-download. |
| `createdAt` | `string` | ISO timestamp when saved. |

### LastFormValues

Stored in browser local storage to restore the form after reload.

| Field | Type | Notes |
| --- | --- | --- |
| `draft` | `CertificateDraft` | Last edited values. |
| `updatedAt` | `string` | ISO timestamp. |

## Rendering And Export

- Preview and export must use the same template source so the live preview
  matches downloaded files.
- The first template is the existing "Black Border" design: blue double border,
  corner flourishes, serif headline, centered logo mark, formal labels, and a
  light print-friendly certificate artifact.
- PNG export uses full `puppeteer` with bundled Chromium, a shared browser
  instance, a new page per request, and `deviceScaleFactor` of 2 to 3.
- PDF export uses the same render pipeline and `page.pdf({ landscape: true,
  printBackground: true })`.
- Fonts are self-hosted through `@font-face`, and rendering waits for
  `document.fonts.ready` before capture.
- Chrome launch flags for Render: `--no-sandbox`, `--disable-setuid-sandbox`,
  and `--disable-dev-shm-usage`.
- Render concurrency should be capped at 1 to 2 renders through a small queue.

## Routes And UI

- `/` - the main single-screen app.
- Left side on desktop: certificate form, template picker, brand settings panel,
  and history list.
- Right side on desktop: live certificate preview plus Download PNG and Download
  PDF actions.
- Mobile: stack the form and controls above the preview.
- The app chrome should be clean, modern, and dark-mode-first around the tool.
- The certificate itself remains light, formal, classic, and print-friendly.

## Tech Stack

- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS v4.
- shadcn/ui for UI components.
- Zod for input validation.
- Puppeteer with bundled Chromium for PNG/PDF rendering.
- Browser local storage for brand settings, history, and last form values.
- Self-hosted web fonts for certificate rendering consistency.
- Render web service for deployment.

Future product stack, not v1: Render Postgres, Prisma, Clerk, Cloudflare R2,
Stripe, and CSV bulk zip generation with `archiver` or `jszip`.

## Deployment

- Target host: Render web service.
- Build command: `npm run build`.
- Start command: `npm run start`.
- Runtime needs full Puppeteer in `dependencies`, not `devDependencies`.
- Add `.puppeteerrc.cjs` with `cacheDirectory` set to
  `join(__dirname, ".cache", "puppeteer")` when Puppeteer is introduced.
- Add `.cache` to `.gitignore` when the Puppeteer cache directory is introduced.
- Render instance: Starter minimum, Standard 2 GB preferred. Avoid free tier
  because spin-down and Chrome memory are poor fits.
- Feature 3 should be verified on Render as soon as PNG export works locally.
- Feature 9 handles hardening: instance sizing, render queue behavior under
  concurrent requests, env config cleanup, and custom domain.

## Monetization

v1 has no monetization. It is a free local tool for Brad and anyone who lands on
it, intended to prove the core certificate flow and rendering pipeline.

Future product direction: freemium SaaS for course creators, with a limited
watermarked free tier and paid Stripe plans for watermark removal, custom
branding, all templates, CSV bulk generation, cloud-saved history, and higher
volume.

## Verification

- No test command is configured yet.
- Until a test gate exists, verify feature work with `npm run lint`,
  `npm run build`, and direct browser or API evidence.
- Logic-bearing steps should add tests after `/tests` configures a runner.
- UI/export behavior needs real visual evidence because design fidelity is the
  core product requirement.

## Open Questions

- Exact Black Border reference asset should live under `blueprint/reference/`
  before implementing the visual recreation.
- Exact page size and margins for the PDF need to be chosen before feature 4.
- Exact self-hosted font files need to be selected before the template/export
  work depends on typography matching.
- The plan names shadcn/ui and Zod, but they are not installed yet. Add them only
  as part of the feature that first needs them.
