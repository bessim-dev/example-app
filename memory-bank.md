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

---

(Add new context and decisions below as the project evolves)
