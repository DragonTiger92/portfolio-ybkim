export const jobStatusCodes = ["actively-looking", "not-looking"] as const;

export type JobStatusCode = (typeof jobStatusCodes)[number];
export type PortfolioLocale = "en" | "ko";

interface LocalizedJobStatus {
  fieldLabel: string;
  values: Record<JobStatusCode, string>;
}

const defaultJobStatusCode: JobStatusCode = "actively-looking";

const jobStatusPolicies = {
  "actively-looking": {
    acceptsEmailContact: true,
  },
  "not-looking": {
    acceptsEmailContact: false,
  },
} as const satisfies Record<JobStatusCode, { acceptsEmailContact: boolean }>;

export const jobStatusCatalog = {
  ko: {
    fieldLabel: "구직 상태",
    values: {
      "actively-looking": "구직 중",
      "not-looking": "구직 중이 아님",
    },
  },
  en: {
    fieldLabel: "Job Search Status",
    values: {
      "actively-looking": "Actively Looking",
      "not-looking": "Currently Not Looking",
    },
  },
} as const satisfies Record<PortfolioLocale, LocalizedJobStatus>;

function isJobStatusCode(value: string): value is JobStatusCode {
  return jobStatusCodes.some((statusCode) => statusCode === value);
}

export function resolveJobStatusCode(configuredStatus: string | undefined): JobStatusCode {
  if (!configuredStatus) {
    return defaultJobStatusCode;
  }

  if (isJobStatusCode(configuredStatus)) {
    return configuredStatus;
  }

  throw new Error(
    `Invalid PORTFOLIO_JOB_STATUS "${configuredStatus}". Expected one of: ${jobStatusCodes.join(", ")}.`,
  );
}

export function getJobStatusContent(locale: PortfolioLocale, status: JobStatusCode) {
  const localizedStatus = jobStatusCatalog[locale];

  return {
    acceptsEmailContact: jobStatusPolicies[status].acceptsEmailContact,
    fieldLabel: localizedStatus.fieldLabel,
    valueLabel: localizedStatus.values[status],
  };
}
