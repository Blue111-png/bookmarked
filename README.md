# Bookmarked

Bookmarked is a lightweight shared resource board. Cohort members post links
worth revisiting (articles, docs, tools, videos), tag them, react to ones
they found helpful, and browse the feed filtered by tag.

This repo is a sprint-phase project for the freeCodeCamp/NHCarrigan Summer
2026 Cohort. It's a real, runnable full-stack app - fork it, claim an issue,
and open a PR. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the
issue-claiming workflow.

## Stack

- **Frontend**: Next.js (App Router), React, TypeScript, plain CSS
- **API**: Node.js + Express, Mongoose, TypeScript
- **Database**: MongoDB
- **Auth**: JWT (email + password, bcrypt-hashed). This is intentionally
  simple for a sprint exercise - there's no email verification or password
  reset flow.
- **Tests**: Jest + Supertest + ts-jest (API), Jest + Testing Library (frontend)

This is the only fully TypeScript project among the sprint repos - if you
want to practice static typing in the JS ecosystem specifically (as opposed
to Python type hints or Java), this is the one.

## Quickstart

The fastest way to run the whole stack is Docker Compose:

```bash
cp .env.example .env
docker-compose up --build
```

This starts three services:

- `mongo` - MongoDB on port `27018`
- `api` - Express API on [http://localhost:4100](http://localhost:4100)
- `web` - Next.js frontend on [http://localhost:3100](http://localhost:3100)

Once it's up, seed some demo data:

```bash
docker-compose exec api npm run seed
```

Then open [http://localhost:3100](http://localhost:3100) and log in with one
of the seeded accounts (see `api/src/seed.ts` for emails - the password for
all of them is `password123`), or register your own account.

### Running without Docker

```bash
# API
cd api
cp .env.example .env
npm install
npm run seed   # requires a local MongoDB running on the URI in .env
npm run dev

# Frontend (in a separate terminal)
cd web
cp .env.example .env
npm install
npm run dev
```

## API overview

| Method | Route                              | Auth required | Description                     |
| ------ | ----------------------------------- | -------------- | -------------------------------- |
| POST   | `/api/auth/register`                | no             | Create an account                |
| POST   | `/api/auth/login`                   | no             | Log in, get a JWT                |
| GET    | `/api/resources`                    | no             | List resources, optional `?tag=` / `?submittedBy=` filters |
| GET    | `/api/resources/:id`                | no             | Get a single resource            |
| POST   | `/api/resources`                    | yes            | Share a new resource             |
| POST   | `/api/resources/:id/reactions`      | yes            | Add an emoji reaction            |
| DELETE | `/api/resources/:id/reactions/:rid` | yes            | Remove your own reaction         |

The data model is intentionally shallow: a `User` has an email, display name,
and password hash. A `Resource` has a submitter, title, URL, description,
tags, and an embedded array of reactions (emoji + reacting user).

## Testing

```bash
# API tests (spins up an in-memory MongoDB, no external DB needed)
cd api
npm install
npm test

# Frontend tests
cd web
npm install
npm test
```

CI runs both suites on every push and pull request - see
[.github/workflows/ci.yml](./.github/workflows/ci.yml).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to claim an issue, the PR
workflow, and how to run tests locally before you submit.

## License

[MIT](./LICENSE)
