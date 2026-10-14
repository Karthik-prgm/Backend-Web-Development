# Database Integration

The posts repository now uses PostgreSQL through Prisma. Services and controllers continue to use the existing repository contract and do not import Prisma.

## Setup (PowerShell or CMD)

1. Install PostgreSQL and create a database named `community_dev`.
2. Copy `.env.example` to `.env` and replace the sample password locally. Never commit `.env`.
3. Install dependencies and generate Prisma Client:

```sh
npm install
npm run prisma:generate
npm run prisma:validate
```

4. Apply the committed migration (do not use `db push`):

```sh
npm run prisma:deploy
npm run db:seed
npm start
```

For local schema development, use `npm run prisma:migrate -- --name descriptive_name`. To recreate a disposable local database, drop and recreate only the local `community_dev` database, then run `npm run prisma:deploy` and `npm run db:seed`. Do not reset shared or production databases.

## Repository contract

- `findAll()` returns an array, including `[]` when empty.
- `findById(id)` returns a post or `null`.
- `create(fields)` returns the created post in the legacy API shape.
- `update(id, patch)` returns the updated post or `null`.
- `remove(id)` returns `true` or `false`.

The schema includes users, posts, comments, votes, follows, tags, and the post/tag join table. Foreign-key deletion behavior, unique relationship constraints, and lookup indexes are explicit.
