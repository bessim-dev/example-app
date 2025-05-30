# Memory Bank

## Project Context & Decisions

### SaaS & Target Audience

- This project is a SaaS platform with an API and a mobile SDK (React Native) for OCR, initially focused on the vehicle industry but designed to expand to other industries.
- Users are professionals in the vehicle industry, with expected high request volume and need for reliability and scalability.

### Caching Strategy (May 2024)

- OCR inference (via Groq) is expensive; results are cached to reduce cost and latency.
- Redis is used as the cache backend for scalability and distributed deployments.
- Cache key: SHA-256 hash of the image data, namespaced by OCR type (e.g., `car-plate:<hash>`).
- Default cache TTL: 7 days (configurable).
- Caching is implemented server-side (API), not in the mobile SDK, to ensure consistency and avoid stale results.
- Observability: cache hits/misses are logged, and cache stats may be exposed for monitoring.

### Logging & Observability (May 2024)

- All HTTP requests are logged in structured JSON format using a custom logger middleware.
- Log fields include timestamp, method, path, status, requestId (via hono/request-id), serverTiming (from hono/timing), and cacheStatus (hit/miss/none).
- The `Server-Timing` response header is set for each request, enabling client-side and observability tool metrics.
- This approach enables easy integration with log aggregation and observability tools (e.g., Datadog, ELK, CloudWatch).
- The log format is easily extensible to include user/session/request ID or other metadata for traceability.

### Authentication Integration (May 2024)

- Integrated Better-auth for client-side authentication with both OAuth (GitHub, Google) and email/password login.
- Auth client configured to connect with the server at `http://localhost:3000`.
- **TanStack Router Integration**:
  - Router context provides auth state to all routes via `RouterContext` interface
  - Protected routes use `beforeLoad` function to check authentication and redirect to login
  - Login route uses `beforeLoad` to redirect authenticated users to dashboard
  - Proper redirect handling with search params for post-login navigation
- Auth state managed through router context, not component-level checks
- Login form uses `useSearch` to handle redirect parameters from protected routes
- File-based routing structure follows TanStack Router conventions with proper auth guards

### Dashboard Structure (May 2024)

- Modern SaaS dashboard with sidebar navigation, optimized for OCR business use cases.
- Navigation includes: Dashboard, OCR Requests, Analytics, API Keys, Billing.
- OCR-specific sections: Car Plates (Recent Scans, History), Documents (Invoices, Receipts, IDs), API documentation.
- Uses shadcn/ui components with Tailwind CSS for modern, professional UI.
- Sidebar includes user profile with logout functionality and upgrade prompts.
- Protected by TanStack Router auth guards using `beforeLoad` patterns.

---

(Add new context and decisions below as the project evolves)
