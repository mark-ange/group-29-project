# Security checklist

| Control | Status | How to check |
|---|---|---|
| Passwords use bcrypt cost 12 and are not returned | Implemented | Register a user and inspect only `passwordHash` in local SQLite; it must be a bcrypt hash. |
| JWT sessions carry id and role; no guest fallback | Implemented | Sign in as seeded admin and guest, then call a protected route without a session. |
| Admin/host routes enforce roles and host property ownership | Implemented | A guest receives 403 on `/admin`; a host editing another owner’s property receives 404. |
| Register, login, and booking attempts are rate-limited | Implemented | Repeat requests until 429 and inspect `Retry-After` on register and booking. |
| Mutating API routes check Origin; request schemas reject unknown keys | Implemented | Send a cross-origin POST and a body with an extra field; both must be rejected. |
| Photo uploads verify signatures, limits, random names, and WEBP re-encoding | Implemented | Try unsupported files and oversized images; verify output is WEBP with no source metadata. |
| API errors hide internal messages and stack traces | Implemented | Trigger an unexpected error and confirm the response is generic. |
| CSP and security headers are configured | Implemented | Inspect response headers. Inline scripts support Next.js hydration; inline styles support streamed styles and GSAP transforms. |
| Booking overlap check and insert share a Serializable transaction | Implemented | Submit overlapping requests concurrently; only one should succeed. PostgreSQL should retain Serializable isolation and retry serialization conflicts. |
| Secrets stay out of Git; environment templates are present | Implemented | Check `.gitignore` and scan tracked files for credentials. |
| Audit and browser suite | Pending | Run `npm audit`, `npm test`, and `npm run test:e2e`; resolve outstanding advisories and browser failures before release. |

Playwright uses `prisma/test.db`, separate from development data. Production should use HTTPS, `APP_DEBUG=false`, PostgreSQL, object storage, and a shared rate-limit store.
