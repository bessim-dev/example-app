import { groqService } from "@/services/groqService";
import type { OcrType, OcrRequest, OcrResult } from "@/types/ocr";

export const supportedOcrTypes = [
  "car-plate",
  "id",
  "receipt",
  "invoice",
] as const;

export const ocrHandlers: Record<
  OcrType,
  (req: OcrRequest) => Promise<{ result: OcrResult; cached?: boolean }>
> = {
  "car-plate": async (req) => {
    const [result, cached] = (await groqService.ocrCarPlate(
      req.image,
      true
    )) as [OcrResult, boolean];
    return { result, cached };
  },
  id: async () => {
    throw new Error("Not implemented");
  },
  receipt: async () => {
    throw new Error("Not implemented");
  },
  invoice: async () => {
    throw new Error("Not implemented");
  },
};
