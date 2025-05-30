import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import createApp from "@/lib/create-app";
import auth from "@/routes/auth";
import ocr from "@/routes/ocr";
import { requestId } from "hono/request-id";
import { cors } from "hono/cors";
import { handleRootAdminUser } from "@/services/auth-service";

const app = createApp();

// CORS configuration for frontend requests
app.use(
  "*",
  cors({
    origin: "http://localhost:3003",
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "X-Custom-Header",
      "Upgrade-Insecure-Requests",
    ],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", requestId());
app.use("*", logger());

const routes = [auth, ocr] as const;

routes.forEach((route) => {
  app.basePath("/api").route("/", route);
});

handleRootAdminUser();

app.get("*", serveStatic({ root: "../client/dist" }));
app.get("*", serveStatic({ path: "index.html", root: "../client/dist" }));

export type AppType = (typeof routes)[number];

export default app;
