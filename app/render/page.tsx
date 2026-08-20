import { notFound } from "next/navigation";

import { BlackBorderCertificate } from "@/components/certificate/BlackBorderCertificate";
import {
  DEFAULT_CERTIFICATE_DRAFT,
  type CertificateDraft,
} from "@/types/certificate";

type RenderSearchParams = Record<
  keyof CertificateDraft,
  string | string[] | undefined
>;

type RenderPageProps = {
  searchParams: Promise<RenderSearchParams>;
};

function readValue(
  value: string | string[] | undefined,
  fallback: string,
) {
  return typeof value === "string" ? value : fallback;
}

export default async function RenderPage({ searchParams }: RenderPageProps) {
  const params = await searchParams;
  const draft: CertificateDraft = {
    recipientName: readValue(
      params.recipientName,
      DEFAULT_CERTIFICATE_DRAFT.recipientName,
    ),
    courseTitle: readValue(
      params.courseTitle,
      DEFAULT_CERTIFICATE_DRAFT.courseTitle,
    ),
    issueDate: readValue(
      params.issueDate,
      DEFAULT_CERTIFICATE_DRAFT.issueDate,
    ),
    instructorName: readValue(
      params.instructorName,
      DEFAULT_CERTIFICATE_DRAFT.instructorName,
    ),
    templateId: readValue(
      params.templateId,
      DEFAULT_CERTIFICATE_DRAFT.templateId,
    ),
  };

  if (draft.templateId !== "black-border") {
    notFound();
  }

  return (
    <main
      data-certificate-export
      className="h-[1000px] w-[1414px] overflow-hidden bg-white"
    >
      <BlackBorderCertificate draft={draft} />
    </main>
  );
}
