"use client";

import { useState } from "react";

import type { CertificateDraft } from "@/types/certificate";

type DownloadPngButtonProps = {
  draft: CertificateDraft;
};

export function DownloadPngButton({ draft }: DownloadPngButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setIsDownloading(true);
    setError(null);
    let objectUrl: string | null = null;

    try {
      const response = await fetch("/api/export-png", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        throw new Error("Export request failed");
      }

      const blob = await response.blob();

      if (blob.type !== "image/png") {
        throw new Error("Export returned an unexpected file type");
      }

      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "certificate.png";
      document.body.append(link);
      link.click();
      link.remove();
    } catch {
      setError("Could not download the PNG. Please try again.");
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      setIsDownloading(false);
    }
  }

  return (
    <div className="grid justify-items-end gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className="inline-flex h-[var(--control-height)] items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:shadow-[var(--focus-ring)] disabled:cursor-wait disabled:opacity-60"
      >
        {isDownloading ? "Generating PNG..." : "Download PNG"}
      </button>
      {error ? (
        <p className="max-w-52 text-right text-xs text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
