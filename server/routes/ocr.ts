import { createRouter } from "@/lib/create-app";
import { ocrHandlers, supportedOcrTypes } from "@/handlers/ocr";
import { ocrRequestSchema } from "@/validation/ocrSchemas";
import { OcrType } from "@/types/ocr";

const router = createRouter();

router.post("/ocr/:type?", async (c) => {
  const type = c.req.param("type") ?? "car-plate";
  if (!supportedOcrTypes.includes(type as OcrType)) {
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
    const handlerResult = await ocrHandlers[type as OcrType](parseResult.data);
    // For car-plate, include cache info; for others, just return result
    if (type === "car-plate") {
      return c.json(
        {
          success: true,
          data: handlerResult.result,
          cached: handlerResult.cached,
          error: null,
        },
        200,
        {
          "Cache-Status": handlerResult.cached ? "hit" : "miss",
        }
      );
    } else {
      return c.json({ success: true, data: handlerResult.result, error: null });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return c.json({ success: false, data: null, error: errorMsg }, 500);
  }
});

export default router;
