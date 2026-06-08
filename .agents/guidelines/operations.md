# Operations Guidelines

## File Editing

When editing files:

- Preserve existing formatting where reasonable.
- Do not reorder imports unnecessarily.
- Do not rename files without a clear reason.
- Do not move files unless the requested task requires it.
- Do not delete code unless it is clearly unused or explicitly requested.
- Do not modify generated files unless necessary.
- Do not modify environment files or secrets.
- Do not introduce placeholder code into production paths.

## Environment And Secrets

Do not commit secrets.

Do not expose:

- API keys
- access tokens
- private credentials
- `.env` values
- deployment secrets

If environment variables are needed, use example names and document them without real values.
