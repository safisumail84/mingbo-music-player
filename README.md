# Web Music Bot (Monorepo)

Monorepo with:

- `backend/` - TypeScript Express audio proxy (`/api/info`, `/api/stream`)
- `frontend/` - Vue 3 + Pinia UI (queue + player bar)
- `docker-compose.yml` - full stack (Nginx frontend + backend)
- `docker-compose.cyberpanel.yml` - backend-only (for CyberPanel/OpenLiteSpeed)

## Local dev (2 terminals)

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend (Vite is pinned to port 8080 via `frontend/vite.config.ts`):

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:8080`.

## Docker (Local / Full Stack)

```bash
docker compose up -d --build
```

- UI: `http://localhost:8080`
- API: `http://localhost:3000/healthz`

## CyberPanel / OpenLiteSpeed (Backend in Docker, Frontend in `public_html`)

Run only the backend container:

```bash
docker compose -f docker-compose.cyberpanel.yml up -d --build
```

Build the frontend and upload `frontend/dist/` to your domain's `public_html`.

To keep the frontend calling `/api/...` without CORS/mixed-content issues, configure OpenLiteSpeed to reverse-proxy `/api` to `http://127.0.0.1:3000` (via a proxy context or rewrite rule).

