# Frontend (Next.js)

This frontend consumes the existing FastAPI endpoints from the backend project.

## 1) Install

```bash
cd frontend
npm install
```

## 2) Configure API URL

Set API base URL (defaults to `http://localhost:8000/api/v1`):

```bash
echo NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1 > .env.local
```

## 3) Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- This UI follows current backend paths exactly.
- Users routes are currently served under `/api/v1/uesrs` (as defined by backend router).
