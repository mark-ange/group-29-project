# Copilot Instructions for StayNest

Project: StayNest (placeholder name), a premium short-stay booking site. Guests browse and book. Hosts and admins manage listings. Keep the design original: don't copy Airbnb's name, logo, layout, or listings.

Stack:
- Next.js App Router with strict TypeScript.
- Tailwind CSS v4, with theme tokens in globals.css using @theme.
- Prisma 6 with SQLite in development.
- Zod for all validation.
- Auth.js (next-auth v5).
- GSAP with ScrollTrigger and Flip.
- Lenis for smooth scrolling.
- @google/model-viewer for 3D models.
- bcryptjs for passwords.

Architecture:
- Business logic lives in src/lib/services/.
- Route handlers and server actions stay thin and call services.
- Use server components by default, and add 'use client' only where you need interactivity or animation.

Security:
- Validate every input with Zod.
- Never trust prices, totals, or user IDs from the client.
- Compute them on the server and take the user from the session.
- Never return password hashes or other users' private data.
- Check role and ownership on every admin action.
- Never use dangerouslySetInnerHTML with user content.
- Keep secrets in .env, and keep .env.example up to date.

Next.js:
- params and searchParams are Promises in this version, so await them.
- When unsure, check the docs for the installed version.

Design:
- Premium and minimal.
- Generous spacing, large photos, rounded-2xl cards, soft shadows, one accent color defined as a theme token.
- Mobile first.
- Every list needs loading, empty, and error states.

Motion:
- Respect prefers-reduced-motion.
- Wrap GSAP work in gsap.context() and clean it up on unmount.

Images:
- Property photos live in public/properties/<slug>/ with number prefixes, like 01-exterior.jpg and 02-bedroom.jpg.
- 3D renders are named 3d-something.jpg.
- An optional model.glb in the same folder is an interactive 3D model.
- Admin uploads go to public/uploads/<propertyId>/.
- A property without photos shows a styled placeholder with its city, never a broken image.

Code quality:
- No any.
- Descriptive names.
- No duplicated logic.
- No commented-out code.
- No TODOs unless you explain them in your reply.

Working method:
- Before editing, list the files you'll create or change.
- Keep changes surgical and focused on the task.
- Prefer existing patterns and project conventions.
- After changes, run npm run lint and npm run build and fix every error.
- End with a short summary and how to test the change.

Done when:
- The file exists with all of these rules.
