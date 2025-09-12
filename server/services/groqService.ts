import type { OcrResult, OcrType, GenericOcrStructuredResult, OcrRequest } from "@/types/ocr";
import Groq from "groq-sdk";
import { hashImage, getCache, setCache } from "../lib/cache";
import { OCR_PROMPTS, JSON_MODE, DEFAULT_MODEL, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS } from "@/lib/ocr/constants";
import { postProcessDrivingPermit } from "@/lib/ocr/postprocess";
import { buildPrompt, filterResultFields, getTodayIsoUTC, hashImages, normalizeImages } from "@/lib/ocr/utils";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export const groqService = {
  async detectType(req: OcrRequest): Promise<{ type: OcrType | null; confidence: number }> {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }
    const images = normalizeImages(req);
    if (!images.length) {
      throw new Error("No images provided");
    }
    const prompt = `Identify the document type among these options precisely: ["car-plate","driving_permit","kbis","responsibility_insurance","vigilance_certificate","rib","wcarh","truck_ownership","company_status"]. Return ONLY JSON: {"type": <one of the options or null>, "confidence": <0..1>}. If unsure, set type=null and confidence=0.`;
    const response = await groq.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "user",
          content: ([
            { type: "text" as const, text: prompt },
            ...images.map((img) => ({
              type: "image_url" as const,
              image_url: { url: `data:image/jpeg;base64,${img}` },
            })),
          ]),
        },
      ],
      temperature: DEFAULT_TEMPERATURE,
      max_completion_tokens: 256,
      top_p: 1,
      stream: false,
      response_format: JSON_MODE,
    });
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned from Groq API");
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    const type = parsed?.type ?? null;
    const confidence = typeof parsed?.confidence === "number" ? parsed.confidence : 0;
    const allowed: string[] = [
      "car-plate",
      "driving_permit",
      "kbis",
      "responsibility_insurance",
      "vigilance_certificate",
      "rib",
      "wcarh",
      "truck_ownership",
      "company_status",
    ];
    if (type && !allowed.includes(type)) {
      return { type: null, confidence: 0 };
    }
    return { type, confidence };
  },
  async ocrCarPlate(
    image: string,
    withCacheInfo = false
  ): Promise<OcrResult | [OcrResult, boolean]> {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }
    const cacheKey = hashImage(image, "car-plate");
    const cached = await getCache<OcrResult>(cacheKey);
    if (cached) {
      console.info(`[OCR] Cache hit for key: ${cacheKey}`);
      return withCacheInfo ? [cached, true] : cached;
    }
    try {
      const prompt =
        "Extract the car license plate number, country, and region (if available) from this image. Return a JSON object with the fields: 'plate' (string or null), 'plate_confidence' (number between 0 and 1), 'country' (string or null, e.g., 'FR' for France), 'country_confidence' (number between 0 and 1), 'region' (string or null), and 'region_confidence' (number between 0 and 1). If any field is not found, set it to null and its confidence to 0.";
      const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${image}` },
              },
            ],
          },
        ],
        temperature: 0.2,
        max_completion_tokens: 512,
        top_p: 1,
        stream: false,
        response_format: { type: "json_object" },
      });
      // The model should return a JSON object in message.content
      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No content returned from Groq API");
      const result =
        typeof content === "string" ? JSON.parse(content) : content;
      // Ensure all fields are present and fallback to null/0 if missing
      const ocrResult: OcrResult = {
        plate: result.plate ?? null,
        plate_confidence: result.plate_confidence ?? 0,
        country: result.country ?? null,
        country_confidence: result.country_confidence ?? 0,
        region: result.region ?? null,
        region_confidence: result.region_confidence ?? 0,
      };
      await setCache(cacheKey, ocrResult);
      console.info(`[OCR] Cache miss for key: ${cacheKey}`);
      return withCacheInfo ? [ocrResult, false] : ocrResult;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      throw new Error(`Groq OCR failed: ${errorMsg}`);
    }
  },
  async ocrStructured(
    type: Exclude<OcrType, "car-plate">,
    req: OcrRequest,
    withCacheInfo = false
  ): Promise<GenericOcrStructuredResult | [GenericOcrStructuredResult, boolean]> {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }
    const images = normalizeImages(req);
    if (!images.length) {
      throw new Error("No images provided");
    }
    const today = getTodayIsoUTC();
    const basePrompt = (OCR_PROMPTS as Record<string, string>)[type].replace(/\{current_date\}/g, today);
    const prompt = buildPrompt(basePrompt, req.fields);
    const cacheKey = hashImages(images, type, req.fields);
    const cached = await getCache<GenericOcrStructuredResult>(cacheKey);
    if (cached) {
      console.debug(`[OCR][service] hit key=${cacheKey}`);
      const filtered = filterResultFields(cached, req.fields);
      return withCacheInfo ? [filtered, true] : filtered;
    }

    try {
      const start = Date.now();
      console.debug(`[OCR][service] call type=${type} imgs=${images.length}`);
      const response = await groq.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "user",
            content: ([
              { type: "text" as const, text: prompt },
              ...images.map((img) => ({
                type: "image_url" as const,
                image_url: { url: `data:image/jpeg;base64,${img}` },
              })),
            ]),
          },
        ],
        temperature: DEFAULT_TEMPERATURE,
        max_completion_tokens: DEFAULT_MAX_TOKENS,
        top_p: 1,
        stream: false,
        response_format: JSON_MODE,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No content returned from Groq API");
      const result =
        typeof content === "string" ? (JSON.parse(content) as GenericOcrStructuredResult) : (content as GenericOcrStructuredResult);

      await setCache(cacheKey, result);
      console.debug(`[OCR][service] miss key=${cacheKey} ms=${Date.now() - start}`);

      let processed = result;
      if (type === "driving_permit") {
        processed = postProcessDrivingPermit(processed);
      }
      const filtered = filterResultFields(processed, req.fields);
      return withCacheInfo ? [filtered, false] : filtered;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.debug(`[OCR][service] error type=${type} msg=${errorMsg}`);
      throw new Error(`Groq OCR failed: ${errorMsg}`);
    }
  },
};
