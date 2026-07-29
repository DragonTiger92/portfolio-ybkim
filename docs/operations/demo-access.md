# Demo Access Operations

Karly and Book-Kong use separate, non-administrative test accounts. The public
portfolio exposes a request path, never the credentials or a reusable secure
delivery link.

## Recruiter Request Flow

1. The recruiter opens the Karly or Book-Kong project card on the landing page,
   or the corresponding project detail.
2. `테스트 계정 요청` on either surface opens Gmail in a new tab with the
   portfolio address, project-specific subject, purpose statement, and optional
   review end date. The recruiter may also suggest a separate contact channel
   for the Send password.
3. Sending the message creates the notification and the initial private metadata
   record in the owner's Gmail inbox.
4. The owner replies in the same thread with a password-protected Bitwarden Send
   link, then provides the Send password through the separately confirmed
   channel. The demo ID and password are never placed directly in the email.

The public UI does not claim instant or automatic account delivery. The owner
reviews each request before sharing access.

## Owner Account Setup

The owner must create a free Bitwarden account and sign in to create, edit,
disable, or delete Sends. Verify the account email if Bitwarden requests it.
Keep the Bitwarden master password and recovery material outside this repository.

Recruiters do not need Bitwarden accounts to receive a Send. A Bitwarden
organization is not required for this owner-reviewed workflow.

## Gmail Tracking

Create a Gmail filter for subjects beginning with `[Portfolio Demo Access]` and
apply the `portfolio-demo-access/pending` label. Gmail already records the
requester address, project subject, and request time.

Move the thread through these labels:

| Label                           | Meaning                                      |
| ------------------------------- | -------------------------------------------- |
| `portfolio-demo-access/pending` | Request received; no credential link sent    |
| `portfolio-demo-access/sent`    | Secure link sent; access window still active |
| `portfolio-demo-access/closed`  | Access window ended and credential rotated   |

Do not copy recruiter addresses or request history into the repository.

## Secure Delivery

Create one text Send for the requested project through
[Bitwarden Send](https://bitwarden.com/help/create-send/):

- choose `Anyone with a password set by you` and generate a unique Send password;
- set the Send deletion or expiration time to 72 hours;
- limit views to two;
- include the project name, demo URL, login ID, password, and access-window end;
- add a private note containing the requester email, sent time, access-window
  end, and current status; and
- reply to the original Gmail thread with only the Send link and the access
  window; and
- provide the Send password through a separately confirmed channel such as the
  recruiter's company phone or verified professional profile.

The free Bitwarden plan supports the text Send used here, including password
protection, lifespan controls, access-count limits, and a private note.
Email-verified `Specific people` access requires a paid Bitwarden plan and is not
part of this baseline. Do not use an unprotected `Anyone with the link` Send. If
the requester has no acceptable second channel, agree on one before sending the
credential.

The Send link's expiration only prevents another retrieval of the message. It
does not invalidate a credential already viewed.

## Access Expiration

Use the review end date from the request. When it is omitted, use a seven-day
access window.

After the latest active access window for a project ends:

1. rotate that project's test-account password;
2. update the stored credential without copying it into project files;
3. disable or delete the Send if it is still active;
4. mark the Send private note and Gmail thread as closed; and
5. move the thread to `portfolio-demo-access/closed`.

If the Send reaches the wrong recipient or the credential may be exposed,
disable the Send and rotate the project password immediately.

## Repository Boundary

- Keep IDs, passwords, Send links, recruiter addresses, and request history out
  of source, Markdown, screenshots, tests, analytics, commits, and CI logs.
- Store only the public request copy and non-secret operating procedure here.
- Do not add a credential-returning API to the static portfolio solely to
  automate this low-volume owner-reviewed workflow.
