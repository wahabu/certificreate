import { captureScreenshot } from "@/lib/browser";
import {
  CERTIFICATE_DRAFT_FIELDS,
  parseCertificateDraft,
} from "@/lib/export-validation";
import type { CertificateDraft } from "@/types/certificate";

export const runtime = "nodejs";

const EXPORT_WIDTH = 1414;
const EXPORT_HEIGHT = 1000;
const EXPORT_SCALE = 2;
const CAPTURE_SELECTOR = "[data-certificate-export]";

function createRenderUrl(request: Request, draft: CertificateDraft) {
  const requestPort = new URL(request.url).port;
  const port = process.env.PORT || requestPort || "3000";
  const url = new URL("/render", `http://127.0.0.1:${port}`);

  for (const field of CERTIFICATE_DRAFT_FIELDS) {
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

  const draft = parseCertificateDraft(payload);

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
