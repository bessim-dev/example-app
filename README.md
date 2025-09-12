# OCRUS

This application uses a client - server architecture.

The client stack is:

- Vite
- React
- Tanstack Router
- Better-Auth
- Tanstack Query (upcoming)
- TailwindCSS (upcoming)
- Shadcn UI (upcoming)

The server stack is:

- Bun
- Hono
- PostgreSQL
- Prisma
- Better-Auth
- Zod (upcoming)

## How to run the application

### Run the server

1. Navigate to the server directory and run `bun install` to install the dependencies.
2. Create the `.env` file and add the environment variables from the `.env.example` file.

```
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

DATABASE_URL=
```

3. Run `bun run dev` to start the development server.

### Run the client

1. Navigate to the client directory and run `bun install` to install the dependencies.
2. Run `bun run dev` to start the development server.

### Caching & Redis Setup

The server uses Redis to cache OCR inference results, reducing cost and latency for repeated or duplicate requests. This is especially important for SaaS scalability and high request volumes.

- **Cache Key:** SHA-256 hash of the image data, namespaced by OCR type (e.g., `car-plate:<hash>`)
- **Default TTL:** 7 days (configurable via environment variable)
- **Backend:** Redis (local or managed, e.g., AWS ElastiCache)

#### Environment Variables

Add the following to your `.env` file:

```
REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=604800 # 7 days
```

#### Running Redis Locally

You can run Redis locally using Docker:

```
docker run -d -p 6379:6379 --name redis redis
```

### Logging & Observability

The server uses a custom logger middleware for all HTTP requests, outputting structured JSON logs. This includes:

- `timestamp`: ISO string of the request time
- `requestId`: Unique request ID (via hono/request-id)
- `method`: HTTP method
- `path`: Request path
- `status`: HTTP status code
- `serverTiming`: Value of the `Server-Timing` response header (set by hono/timing)
- `cacheStatus`: Indicates if the result was served from cache (`hit`, `miss`, or `none`)

**Metrics:**

- The `Server-Timing` response header is set using [hono/timing](https://hono.dev/middleware/builtin/timing), which can be used by clients and observability tools to measure response times.

Example log:

```json
{
  "timestamp": "2024-05-20T12:34:56.789Z",
  "requestId": "b7e1c2f0-1234-4a5b-8c2d-abcdef123456",
  "method": "POST",
  "path": "/api/ocr/car-plate",
  "status": 200,
  "serverTiming": "total;dur=123",
  "cacheStatus": "hit"
}
```
