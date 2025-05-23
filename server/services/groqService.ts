import type { OcrResult } from "@/types/ocr";
import Groq from "groq-sdk";
import { hashImage, getCache, setCache } from "../lib/cache";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const groqService = {
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
};
