"use client";

import { useState } from "react";

import { CertificateForm } from "@/components/studio/CertificateForm";
import { CertificatePreview } from "@/components/studio/CertificatePreview";
import {
  DEFAULT_CERTIFICATE_DRAFT,
  type CertificateDraft,
} from "@/types/certificate";

type EditableCertificateField = Exclude<keyof CertificateDraft, "templateId">;

export function CertificateStudio() {
  const [draft, setDraft] = useState<CertificateDraft>(() => ({
    ...DEFAULT_CERTIFICATE_DRAFT,
  }));

  const handleFieldChange = (
    field: EditableCertificateField,
    value: string,
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-page-bg text-text-main">
      <header className="border-b border-[var(--border-subtle)] bg-surface-1">
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3 px-5 py-4 sm:px-8">
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
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-8 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Certificate studio
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text-strong sm:text-3xl">
            Create a polished certificate
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
            Enter the certificate details and review every change instantly.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.6fr)] lg:gap-8">
          <div className="min-w-0">
            <CertificateForm
              draft={draft}
              onFieldChange={handleFieldChange}
            />
          </div>
          <CertificatePreview draft={draft} />
        </div>
      </div>
    </main>
  );
}
