# FastAPI Backend Clean Architecture

Practical FastAPI backend project organized with Clean Architecture layers.

## Project Structure

- `src/app/domain`: Core business entities, value objects, and domain rules.
- `src/app/application`: Use-cases (commands/queries), ports, and app services.
- `src/app/infrastructure`: Adapters for DB/auth/hashers and external concerns.
- `src/app/presentation`: HTTP controllers, middleware, request/response mapping.
- `src/app/setup`: App bootstrap, config loading, DI/IoC wiring.

## Requirements

- Python `3.13.x`
- PostgreSQL (local)
- Git Bash or PowerShell
- `uv` (optional, see note below)

## Configuration

This project loads environment-specific config from `config/<env>/`.

Required env var:

```bash
APP_ENV=local
```

Valid values:

- `local`
- `dev`
- `prod`

For local development, config files are:

- `config/local/config.toml`
- `config/local/.secrets.toml`

Make sure local DB credentials are present in `.secrets.toml`.

## Install Dependencies

### Option A: `uv` (recommended when stable)

```bash
uv sync
```

### Option B: venv + pip

```bash
py -3.13 -m venv .venv
source .venv/Scripts/activate
python -m pip install -U pip setuptools wheel
pip install -e .
```

## Run the Service

### Standard run (if `uv` package mode works)

```bash
APP_ENV=local uv run python -m app.run
```

### Current stable workaround (`uv` package crash on some Windows setups)

```bash
APP_ENV=local PYTHONPATH=src uv run --no-project uvicorn app.run:make_app --factory --reload --host 0.0.0.0 --port 8000
```

### Run without `uv`

```bash
APP_ENV=local PYTHONPATH=src python -m uvicorn app.run:make_app --factory --reload --host 0.0.0.0 --port 8000
```

## Verify Service

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health endpoint: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

Quick check:

```bash
curl -i http://localhost:8000/api/v1/health
```

Expected response body:

```json
{"status":"ok"}
```

## Logging

Log level is configured from:

- `config/local/config.toml` -> `[logs].LEVEL`

App logging is initialized in `src/app/run.py` via:

- `configure_logging(level=settings.logs.level)`

## Notes

- Root route `/` redirects to `/docs`.
- On startup, SQLAlchemy mappings are initialized in app lifespan.

## Frontend (Next.js)

A Next.js frontend is available in `frontend/` and wired to existing APIs.

Quick start:

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local` if needed
(default is `http://localhost:8000/api/v1`).
