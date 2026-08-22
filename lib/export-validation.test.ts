import { describe, expect, it } from "vitest";

import { parseCertificateDraft } from "./export-validation";

const validDraft = {
  recipientName: "Ada Lovelace",
  courseTitle: "Computing Fundamentals",
  issueDate: "August 22, 2026",
  instructorName: "Charles Babbage",
  templateId: "black-border",
};

describe("parseCertificateDraft", () => {
  it("accepts a complete black-border certificate draft", () => {
    expect(parseCertificateDraft(validDraft)).toEqual(validDraft);
  });

  it("rejects unsupported templates", () => {
    expect(
      parseCertificateDraft({ ...validDraft, templateId: "unknown-template" }),
    ).toBeNull();
  });

  it("rejects missing or unexpected fields", () => {
    expect(
      parseCertificateDraft({
        recipientName: validDraft.recipientName,
        issueDate: validDraft.issueDate,
        instructorName: validDraft.instructorName,
        templateId: validDraft.templateId,
      }),
    ).toBeNull();
    expect(
      parseCertificateDraft({ ...validDraft, unexpected: "value" }),
    ).toBeNull();
  });

  it("rejects non-string and oversized field values", () => {
    expect(parseCertificateDraft({ ...validDraft, recipientName: 42 })).toBeNull();
    expect(
      parseCertificateDraft({
        ...validDraft,
        recipientName: "A".repeat(501),
      }),
    ).toBeNull();
  });
});
