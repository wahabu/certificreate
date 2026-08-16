import type { CSSProperties } from "react";
import Image from "next/image";

import {
  BLACK_BORDER_THEME,
  DEFAULT_CERTIFICATE_DRAFT,
  type BlackBorderCertificateProps,
} from "@/types/certificate";

import styles from "./BlackBorderCertificate.module.css";

type CertificateStyle = CSSProperties & Record<`--${string}`, string>;

const mergeDraft = (draft: BlackBorderCertificateProps["draft"]) => ({
  ...DEFAULT_CERTIFICATE_DRAFT,
  ...draft,
});

const mergeTheme = (theme: BlackBorderCertificateProps["theme"]) => ({
  ...BLACK_BORDER_THEME,
  ...theme,
});

export function BlackBorderCertificate({
  draft,
  theme,
  logoSrc,
}: BlackBorderCertificateProps) {
  const certificateDraft = mergeDraft(draft);
  const certificateTheme = mergeTheme(theme);
  const certificateStyle: CertificateStyle = {
    "--certificate-primary": certificateTheme.primaryColor,
    "--certificate-accent": certificateTheme.accentColor,
    "--certificate-ink": certificateTheme.textColor,
    "--certificate-background": certificateTheme.backgroundColor,
    "--certificate-font-serif": certificateTheme.fontFamilySerif,
    "--certificate-font-sans": certificateTheme.fontFamilySans,
  };

  return (
    <article
      className={styles.certificate}
      style={certificateStyle}
      aria-label="Black Border certificate preview"
    >
      <div className={styles.outerTrim} aria-hidden="true" />
      <div className={styles.border} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.cornerTopLeft}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.cornerTopRight}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.cornerBottomRight}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.cornerBottomLeft}`} aria-hidden="true" />

      <div className={styles.content}>
        <header className={styles.titleBlock}>
          <h1 className={styles.title}>Certificate</h1>
          <p className={styles.subtitle}>of Completion</p>
        </header>

        <p className={styles.certifyLabel}>This is to certify that</p>

        <section className={styles.recipientBlock} aria-label="Recipient">
          <p className={styles.recipientName}>{certificateDraft.recipientName}</p>
          <div className={styles.rule} aria-hidden="true" />
        </section>

        <p className={styles.courseKicker}>
          Has completed the following Traversy Media course:
        </p>
        <p className={styles.courseTitle}>{certificateDraft.courseTitle}</p>

        <footer className={styles.footer}>
          <div className={styles.signatureBlock}>
            <p className={styles.signatureName}>{certificateDraft.instructorName}</p>
            <div className={styles.rule} aria-hidden="true" />
            <p className={styles.footerLabel}>Instructor</p>
          </div>

          {logoSrc ? (
            <Image
              className={styles.logoImage}
              src={logoSrc}
              alt="Organization logo"
              width={160}
              height={160}
              unoptimized
            />
          ) : (
            <div className={styles.logoMark} aria-hidden="true">
              <div className={styles.logoDots}>
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div className={styles.dateBlock}>
            <p className={styles.dateValue}>{certificateDraft.issueDate}</p>
            <div className={styles.rule} aria-hidden="true" />
            <p className={styles.footerLabel}>Date</p>
          </div>
        </footer>
      </div>
    </article>
  );
}
