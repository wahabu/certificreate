import { captureScreenshot } from "@/lib/browser";
import type { CertificateDraft } from "@/types/certificate";

export const runtime = "nodejs";

const DRAFT_FIELDS = [
  "recipientName",
  "courseTitle",
  "issueDate",
  "instructorName",
  "templateId",
] as const satisfies ReadonlyArray<keyof CertificateDraft>;

const MAX_FIELD_LENGTH = 500;
const EXPORT_WIDTH = 1414;
const EXPORT_HEIGHT = 1000;
const EXPORT_SCALE = 2;
const CAPTURE_SELECTOR = "[data-certificate-export]";

function parseDraft(value: unknown): CertificateDraft | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);

  if (
    keys.length !== DRAFT_FIELDS.length ||
    keys.some((key) => !DRAFT_FIELDS.includes(key as keyof CertificateDraft))
  ) {
    return null;
  }

  for (const field of DRAFT_FIELDS) {
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

function createRenderUrl(request: Request, draft: CertificateDraft) {
  const requestPort = new URL(request.url).port;
  const port = process.env.PORT || requestPort || "3000";
  const url = new URL("/render", `http://127.0.0.1:${port}`);

  for (const field of DRAFT_FIELDS) {
    url.searchParams.set(field, draft[field]);
  }

  return url.toString();
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const draft = parseDraft(payload);

  if (!draft) {
    return Response.json(
      { error: "Invalid certificate draft." },
      { status: 400 },
    );
  }

  try {
    const png = await captureScreenshot({
      url: createRenderUrl(request, draft),
      selector: CAPTURE_SELECTOR,
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      deviceScaleFactor: EXPORT_SCALE,
    });

    return new Response(Uint8Array.from(png).buffer, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": 'attachment; filename="certificate.png"',
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("PNG export failed", error);
    return Response.json(
      { error: "Unable to render certificate PNG." },
      { status: 500 },
    );
  }
}
