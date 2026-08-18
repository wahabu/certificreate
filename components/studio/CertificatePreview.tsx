import { BlackBorderCertificate } from "@/components/certificate/BlackBorderCertificate";
import type { CertificateDraft } from "@/types/certificate";

type CertificatePreviewProps = {
  draft: CertificateDraft;
};

export function CertificatePreview({ draft }: CertificatePreviewProps) {
  return (
    <section
      className="min-w-0 rounded-xl border border-[var(--border-subtle)] bg-surface-1 p-3 shadow-[var(--shadow-panel)] sm:p-5"
      aria-labelledby="certificate-preview-heading"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-1 pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Live preview
          </p>
          <h2
            id="certificate-preview-heading"
            className="mt-2 text-lg font-semibold tracking-tight text-text-strong"
          >
            Black Border certificate
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="size-2 rounded-full bg-[var(--success)]" />
          Updating live
        </div>
      </header>

      <div className="min-w-0 py-4 sm:py-6">
        <div className="w-full min-w-0 rounded-lg border border-[var(--border-subtle)] bg-surface-2 p-2 shadow-[var(--shadow-certificate)] sm:p-3">
          <BlackBorderCertificate draft={draft} />
        </div>
      </div>
    </section>
  );
}
