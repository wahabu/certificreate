export type CertificateDraft = {
  recipientName: string;
  courseTitle: string;
  issueDate: string;
  instructorName: string;
  templateId: string;
};

export type CertificateTheme = {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamilySerif: string;
  fontFamilySans: string;
};

export type BlackBorderCertificateProps = {
  draft?: Partial<CertificateDraft>;
  theme?: Partial<CertificateTheme>;
  logoSrc?: string | null;
};

export const BLACK_BORDER_THEME: CertificateTheme = {
  primaryColor: "#2f6388",
  accentColor: "#4389ba",
  textColor: "#080808",
  backgroundColor: "#ffffff",
  fontFamilySerif:
    'var(--font-certificate-serif-loaded), Georgia, "Times New Roman", Times, serif',
  fontFamilySans:
    'var(--font-certificate-sans-loaded), "Helvetica Neue", Arial, sans-serif',
};

export const DEFAULT_CERTIFICATE_DRAFT: CertificateDraft = {
  recipientName: "Student Name",
  courseTitle: "Coding With AI: Planning To Production",
  issueDate: "07/13/2026",
  instructorName: "Brad Traversy",
  templateId: "black-border",
};
