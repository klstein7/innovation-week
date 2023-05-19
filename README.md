# Running locally

Create a .env in the root directory with the following content:

```bash
DATABASE_URL=<your postgres database url>
OPENAI_API_KEY=<your openai api key>
```

Then run:

```bash
yarn
yarn prisma migrate dev
yarn prisma db seed
yarn dev
```

The dev server will be running on http://localhost:3000
