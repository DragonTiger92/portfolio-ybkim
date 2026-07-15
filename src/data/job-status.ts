export const jobStatusCodes = ["actively-looking", "not-looking"] as const;

export type JobStatusCode = (typeof jobStatusCodes)[number];
export type PortfolioLocale = "en" | "ko";

interface LocalizedJobStatus {
  fieldLabel: string;
  values: Record<JobStatusCode, string>;
}

export const jobStatusCatalog = {
  ko: {
    fieldLabel: "구직 상태",
    values: {
      "actively-looking": "구직 중",
      "not-looking": "구직 계획 없음",
    },
  },
  en: {
    fieldLabel: "Job Search Status",
    values: {
      "actively-looking": "Actively Looking",
      "not-looking": "Not Currently Looking",
    },
  },
} as const satisfies Record<PortfolioLocale, LocalizedJobStatus>;

export function getJobStatusContent(locale: PortfolioLocale, status: JobStatusCode) {
  const localizedStatus = jobStatusCatalog[locale];

  return {
    fieldLabel: localizedStatus.fieldLabel,
    valueLabel: localizedStatus.values[status],
  };
}
