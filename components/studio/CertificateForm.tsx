"use client";

import type { CertificateDraft } from "@/types/certificate";

type EditableCertificateField =
  | "recipientName"
  | "courseTitle"
  | "issueDate"
  | "instructorName";

type CertificateFormProps = {
  draft: CertificateDraft;
  onFieldChange: (field: EditableCertificateField, value: string) => void;
};

const FORM_FIELDS = [
  {
    name: "recipientName",
    label: "Recipient name",
    placeholder: "Student Name",
  },
  {
    name: "courseTitle",
    label: "Course or achievement",
    placeholder: "Course title",
  },
  {
    name: "issueDate",
    label: "Issue date",
    placeholder: "MM/DD/YYYY",
  },
  {
    name: "instructorName",
    label: "Instructor name",
    placeholder: "Instructor name",
  },
] as const satisfies ReadonlyArray<{
  name: EditableCertificateField;
  label: string;
  placeholder: string;
}>;

export function CertificateForm({
  draft,
  onFieldChange,
}: CertificateFormProps) {
  return (
    <form
      className="rounded-xl border border-[var(--border-subtle)] bg-surface-1 p-5 shadow-[var(--shadow-panel)] sm:p-6"
      onSubmit={(event) => event.preventDefault()}
      aria-labelledby="certificate-details-heading"
    >
      <div className="border-b border-[var(--border-subtle)] pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
          Certificate details
        </p>
        <h2
          id="certificate-details-heading"
          className="mt-2 text-lg font-semibold tracking-tight text-text-strong"
        >
          Personalize your certificate
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Changes appear in the preview as you type.
        </p>
      </div>

      <div className="mt-5 grid gap-5">
        {FORM_FIELDS.map(({ name, label, placeholder }) => (
          <label key={name} className="grid gap-2" htmlFor={name}>
            <span className="text-xs font-semibold text-text-main">{label}</span>
            <input
              id={name}
              name={name}
              type="text"
              value={draft[name]}
              placeholder={placeholder}
              onChange={(event) => onFieldChange(name, event.target.value)}
              className="h-[var(--control-height)] w-full rounded-md border border-[var(--border-subtle)] bg-surface-2 px-3.5 text-sm text-text-strong outline-none transition placeholder:text-[var(--text-faint)] hover:border-[var(--border-strong)] focus:border-accent focus:shadow-[var(--focus-ring)]"
            />
          </label>
        ))}
      </div>
    </form>
  );
}
