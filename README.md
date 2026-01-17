# mydost Frontend

Production-ready Next.js (App Router) frontend for **mydost**.

## Stack
- Next.js App Router + TypeScript
- TailwindCSS
- Streaming chat over SSE

## Environment variables
Create a `.env.local` file or set these in Railway:

```
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://your-domain.com/auth/callback
```

`NEXT_PUBLIC_API_BASE_URL` defaults to `/api` for local development and points at the backend for production.

## Running locally
```
npm install
npm run dev
```

## Railway deployment
1. Create a new Railway project and select **Next.js**.
2. Add the environment variables above in Railway settings.
3. Deploy the repo; Railway will run `npm run build` and `npm start` automatically.

## Notes
- Chat streaming uses SSE via `GET /chat/stream` on the backend.
- Preferences are saved via `POST /api/prefs`.
