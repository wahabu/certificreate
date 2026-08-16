import { BlackBorderCertificate } from "@/components/certificate/BlackBorderCertificate";
import {
  BLACK_BORDER_THEME,
  DEFAULT_CERTIFICATE_DRAFT,
} from "@/types/certificate";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-page-bg text-text-main lg:flex-row">
      <aside className="w-full border-b border-[var(--border-subtle)] bg-surface-1 lg:min-h-screen lg:w-[var(--sidebar-width)] lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col px-5 py-5 sm:px-7 lg:px-6">
          <header className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-5">
            <div className="grid size-10 place-items-center rounded-md bg-accent text-lg font-bold text-white">
              C
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-text-strong">
                Certificreate
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                Local certificate studio
              </p>
            </div>
          </header>

          <section className="border-b border-[var(--border-subtle)] py-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Template
                </p>
                <h2 className="mt-2 text-base font-semibold text-text-strong">
                  Black Border
                </h2>
              </div>
              <span className="rounded-full border border-[var(--border-strong)] bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8fc2e1]">
                Active
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-text-muted">
              Formal landscape certificate with blue double border and classic serif type.
            </p>
          </section>

          <section className="border-b border-[var(--border-subtle)] py-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              Certificate details
            </p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-text-muted">Recipient</dt>
                <dd className="text-right font-medium text-text-main">
                  {DEFAULT_CERTIFICATE_DRAFT.recipientName}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-text-muted">Course</dt>
                <dd className="max-w-[12rem] text-right font-medium text-text-main">
                  {DEFAULT_CERTIFICATE_DRAFT.courseTitle}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-text-muted">Instructor</dt>
                <dd className="text-right font-medium text-text-main">
                  {DEFAULT_CERTIFICATE_DRAFT.instructorName}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-text-muted">Issue date</dt>
                <dd className="text-right font-medium text-text-main">
                  {DEFAULT_CERTIFICATE_DRAFT.issueDate}
                </dd>
              </div>
            </dl>
          </section>

          <section className="mt-auto hidden pt-6 lg:block">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Theme</span>
              <span className="flex items-center gap-2 text-text-main">
                <span className="size-2 rounded-full bg-certificate-blue" />
                Certificate blue
              </span>
            </div>
          </section>
        </div>
      </aside>

      <section className="min-w-0 flex-1 bg-[var(--page-bg-soft)]">
        <div className="mx-auto flex min-h-full w-full max-w-[var(--preview-max)] flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                Certificate preview
              </p>
              <h1 className="mt-2 text-xl font-semibold tracking-tight text-text-strong sm:text-2xl">
                Black Border certificate
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="size-2 rounded-full bg-[var(--success)]" />
              Preview ready
            </div>
          </header>

          <div className="flex flex-1 items-center py-8 sm:py-12">
            <div className="w-full rounded-lg border border-[var(--border-subtle)] bg-surface-1 p-3 shadow-[var(--shadow-certificate)] sm:p-5">
              <BlackBorderCertificate
                draft={DEFAULT_CERTIFICATE_DRAFT}
                theme={BLACK_BORDER_THEME}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
