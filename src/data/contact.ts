const publicEmail = "dczwtu12b+portfolio@gmail.com";

interface GmailDraft {
  body?: string;
  subject?: string;
}

export function createGmailComposeUrl({ body, subject }: GmailDraft = {}): string {
  const parameters = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: publicEmail,
  });

  if (subject) {
    parameters.set("su", subject);
  }

  if (body) {
    parameters.set("body", body);
  }

  return `https://mail.google.com/mail/?${parameters.toString()}`;
}

export const publicContact = {
  email: publicEmail,
  githubProfileUrl: "https://github.com/DragonTiger92",
  gmailComposeUrl: createGmailComposeUrl(),
} as const;
