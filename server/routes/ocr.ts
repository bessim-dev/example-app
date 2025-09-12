import { createRouter } from "@/lib/create-app";
import { ocrHandlers, supportedOcrTypes } from "@/handlers/ocr";
import { ocrRequestSchema } from "@/validation/ocrSchemas";
import { OcrType } from "@/types/ocr";

const router = createRouter();

router.post("/ocr/:type?", async (c) => {
  let type = c.req.param("type");

  if (type && !supportedOcrTypes.includes(type as OcrType)) {
    return c.json(
      { success: false, data: null, error: "Unsupported OCR type" },
      400
    );
  }

  let body;
  try {
    body = await c.req.json();
  } catch (e) {
    return c.json(
      { success: false, data: null, error: "Invalid JSON body" },
      400
    );
  }

  const parseResult = ocrRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json(
      { success: false, data: null, error: parseResult.error.message },
      400
    );
  }

  try {
    // If no type passed, detect it from images
    if (!type) {
      const detection = await (await import("@/services/groqService")).groqService.detectType(parseResult.data);
      if (!detection.type) {
        return c.json({ success: false, data: null, error: "Unable to detect document type" }, 400);
      }
      type = detection.type;
    }

    // Optional fields filtering via query param: ?fields=a,b,c
    const fieldsParam = c.req.query("fields");
    const fields = fieldsParam
      ? fieldsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      : undefined;

    // Standardize to images[] always
    const data = parseResult.data as { image?: string; images?: string[] };
    const images = Array.isArray(data.images) && data.images.length
      ? data.images
      : (data.image ? [data.image] : []);
    if (!images.length) {
      return c.json({ success: false, data: null, error: "No images provided" }, 400);
    }

    const handlerResult = await ocrHandlers[type as OcrType]({ images, fields });
    return c.json(
      {
        success: true,
        data: handlerResult.result,
        cached: handlerResult.cached,
        error: null,
      },
      200,

    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";

    return c.json({ success: false, data: null, error: errorMsg }, 500);
  }
});

export default router;
