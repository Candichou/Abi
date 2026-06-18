# CLAUDE.md — Abi

> Config file for the coding agent. Read this at the start of every session (`/init` already ran once).

## How to work with me (READ FIRST)

I am a developer in training, building this project to defend it before an RNCP jury.
**My goal is to understand my own code, not to ship fast.**

Default behavior — apply unless I explicitly say otherwise:

- **Explain, do not correct.** When I show you code or an error, point out *what* is wrong and *why*, then let me fix it myself. Do NOT write the fix unless I say "write it" / "code it" / "fix it for me".
- **Diagnose, do not implement.** When I ask about a feature, give me 2 approaches with trade-offs and the keywords to research — not a finished implementation.
- **Use Plan/Normal mode, never auto-accept.** Every edit goes through a diff I approve line by line.
- When I do ask you to write code, keep it minimal and add a one-line comment on any non-obvious choice so I can defend it later.
- The test I apply after each session: *if I can't re-explain a piece of code out loud the next day, you did too much.*

**Exceptions where you can go deeper / write directly:** test boilerplate (Vitest), config files, repetitive Tailwind, and anything I flag as "not a competency I need to defend".

## Project context

**Abi** — an ethical directory of health practitioners (medical, paramedical, alternative) validated by associations representing vulnerable or marginalized communities.

Roles:
- **Patient** (user): searches, saves, proposes practitioners, leaves reviews. Pseudonym + email only (no real name required).
- **Association** (user): validates practitioners, moderates, reports.
- **Admin** (me): global management, validates associations, moderation.
- **Practitioner**: referenced data only — NOT a user account.

Validated decisions:
- Partial blurring of practitioner cards for unauthenticated visitors (name + address masked).
- Contribution workflow: patient proposes → association/admin validates → published.

## Stack

- Next.js 16 (App Router) · TypeScript · React
- PostgreSQL via Neon · Drizzle ORM (neon-http adapter)
- BetterAuth · Zod v4 · Tailwind CSS v4
- Vitest · GitHub Actions (CI/CD) · Vercel
- Email: Resend

## Non-negotiable constraints (these come from the RNCP referential)

1. **Security / RGPD first** — sensitive data (health, art. 9 RGPD). When in doubt, choose the more privacy-protective option and tell me why.
2. **Accessibility (RGAA)** — semantic HTML, `aria-*` correct, visible focus, contrast ≥ 4.5:1, touch targets ≥ 44px.
3. **Mobile-first** — base styles target mobile; `md:`/`lg:` override upward.
4. **Eco-design** — avoid unnecessary dependencies and payload.
5. **Multi-layer architecture** (BC02) — keep data access, business logic, and UI separated.

## Security rules already decided (do not regress on these)

- **Never send unmasked sensitive data to unauthenticated clients.** Blurring is server-side, not just CSS/`aria-hidden`. The server must not include practitioner name/address in the payload for non-authenticated requests.
- Sensitive junction tables (tag votes, saved practitioners) use **AES-256-GCM applicative encryption** on `practitionerId` / `tagId`, because they create legally sensitive inferences about users.
- Tags are **practitioner attributes only** — no logging of user filter choices in V1.
- Always validate input **server-side** with Zod, even when the client already validated. Never trust the client.

## Conventions

- **Code, comments and commit messages in English** (technical English is an RNCP asset).
- Git: **GitHub Flow** — feature branches → PR → `main`. Conventional commits (`feat:`, `fix:`, `chore:`). Default to `git pull --rebase`.
- Tailwind v4: design tokens live in `globals.css` under `@theme`, not a config file. Semantic token names (`forest`, `cream`, `lavender`), not `primary`/`secondary`.
- Zod v4: `z.email()` not `z.string().email()`; `safeParse` on the client, `parse` (in try/catch) on the server; `z.infer` for types.
- Validation schemas live in `lib/validations/`.

## Design tokens

- Forest `#002F33` (header/footer) · Cream `#F9F8F1` (background) · Yellow `#F7D452` (keywords/practitioner identity) · Lavender `#DAD0F7` (buttons)
- Headings: Raleway · Body: Open Sans

## RNCP framing (so your suggestions stay relevant)

Everything maps to one of three blocks:
- **BC01** — secure app dev: UI, business components, environment.
- **BC02** — layered architecture, relational DB, data-access components.
- **BC03** — test plans, deployment docs, DevOps.

When you propose something, a one-line note on which block it serves helps me.
