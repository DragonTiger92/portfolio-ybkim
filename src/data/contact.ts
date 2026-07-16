const publicEmail = "dczwtu12b+portfolio@gmail.com";

export const publicContact = {
  email: publicEmail,
  githubProfileUrl: "https://github.com/DragonTiger92",
  gmailComposeUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(publicEmail)}`,
} as const;
