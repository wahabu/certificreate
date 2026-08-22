import type { CertificateDraft } from "../types/certificate";

export const CERTIFICATE_DRAFT_FIELDS = [
  "recipientName",
  "courseTitle",
  "issueDate",
  "instructorName",
  "templateId",
] as const satisfies ReadonlyArray<keyof CertificateDraft>;

const MAX_FIELD_LENGTH = 500;

export function parseCertificateDraft(value: unknown): CertificateDraft | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);

  if (
    keys.length !== CERTIFICATE_DRAFT_FIELDS.length ||
    keys.some(
      (key) =>
        !CERTIFICATE_DRAFT_FIELDS.includes(key as keyof CertificateDraft),
    )
  ) {
    return null;
  }

  for (const field of CERTIFICATE_DRAFT_FIELDS) {
    const fieldValue = record[field];

    if (
      typeof fieldValue !== "string" ||
      fieldValue.length > MAX_FIELD_LENGTH
    ) {
      return null;
    }
  }

  if (record.templateId !== "black-border") {
    return null;
  }

  return record as CertificateDraft;
}
