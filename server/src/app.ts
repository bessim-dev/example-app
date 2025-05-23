import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import createApp from "@/lib/create-app";
import auth from "@/routes/auth";
import ocr from "@/routes/ocr";
import { requestId } from "hono/request-id";
const app = createApp();
app.use("*", requestId());

app.use("*", logger());

const routes = [auth, ocr] as const;

routes.forEach((route) => {
  app.basePath("/api").route("/", route);
});

app.get("*", serveStatic({ root: "../client/dist" }));
app.get("*", serveStatic({ path: "index.html", root: "../client/dist" }));

export type AppType = (typeof routes)[number];

export default app;
