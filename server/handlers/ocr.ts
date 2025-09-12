import { groqService } from "@/services/groqService";
import type {
  OcrType,
  OcrRequest,
  OcrResult,
  GenericOcrStructuredResult,
} from "@/types/ocr";

export const supportedOcrTypes = [
  "car-plate",
  "driving_permit",
  "kbis",
  "responsibility_insurance",
  "vigilance_certificate",
  "rib",
  "wcarh",
  "truck_ownership",
  "company_status",
] as const;

export type AnyOcrResult = OcrResult | GenericOcrStructuredResult;

export const ocrHandlers: Record<
  OcrType,
  (req: OcrRequest) => Promise<{ result: AnyOcrResult; cached?: boolean }>
> = {
  "car-plate": async (req) => {
    const start = Date.now();
    console.debug(`[OCR][handler] car-plate start`);
    const imageStr = req.image ?? (Array.isArray(req.images) && req.images.length > 0 ? req.images[0] : undefined);
    if (!imageStr) {
      throw new Error("No image provided for car-plate OCR");
    }
    const [result, cached] = (await groqService.ocrCarPlate(
      imageStr as string,
      true
    )) as [OcrResult, boolean];
    console.debug(
      `[OCR][handler] car-plate end ms=${Date.now() - start} cached=${cached}`
    );
    return { result, cached };
  },
  driving_permit: async (req) => {
    const start = Date.now();
    console.debug(`[OCR][handler] driving_permit start`);
    const [result, cached] = (await groqService.ocrStructured(
      "driving_permit",
      req,
      true
    )) as [GenericOcrStructuredResult, boolean];
    console.debug(
      `[OCR][handler] driving_permit end ms=${Date.now() - start} cached=${cached}`
    );
    return { result, cached };
  },
  kbis: async (req) => {
    const start = Date.now();
    console.debug(`[OCR][handler] kbis start`);
    const [result, cached] = (await groqService.ocrStructured(
      "kbis",
      req,
      true
    )) as [GenericOcrStructuredResult, boolean];
    console.debug(
      `[OCR][handler] kbis end ms=${Date.now() - start} cached=${cached}`
    );
    return { result, cached };
  },
  responsibility_insurance: async (req) => {
    const start = Date.now();
    console.debug(`[OCR][handler] responsibility_insurance start`);
    const [result, cached] = (await groqService.ocrStructured(
      "responsibility_insurance",
      req,
      true
    )) as [GenericOcrStructuredResult, boolean];
    console.debug(
      `[OCR][handler] responsibility_insurance end ms=${Date.now() - start} cached=${cached}`
    );
    return { result, cached };
  },
  vigilance_certificate: async (req) => {
    const start = Date.now();
    console.debug(`[OCR][handler] vigilance_certificate start`);
    const [result, cached] = (await groqService.ocrStructured(
      "vigilance_certificate",
      req,
      true
    )) as [GenericOcrStructuredResult, boolean];
    console.debug(
      `[OCR][handler] vigilance_certificate end ms=${Date.now() - start} cached=${cached}`
    );
    return { result, cached };
  },
  rib: async (req) => {
    const start = Date.now();
    console.debug(`[OCR][handler] rib start`);
    const [result, cached] = (await groqService.ocrStructured(
      "rib",
      req,
      true
    )) as [GenericOcrStructuredResult, boolean];
    console.debug(
      `[OCR][handler] rib end ms=${Date.now() - start} cached=${cached}`
    );
    return { result, cached };
  },
  wcarh: async (req) => {
    const start = Date.now();
    console.debug(`[OCR][handler] wcarh start`);
    const [result, cached] = (await groqService.ocrStructured(
      "wcarh",
      req,
      true
    )) as [GenericOcrStructuredResult, boolean];
    console.debug(
      `[OCR][handler] wcarh end ms=${Date.now() - start} cached=${cached}`
    );
    return { result, cached };
  },
  truck_ownership: async (req) => {
    const start = Date.now();
    console.debug(`[OCR][handler] truck_ownership start`);
    const [result, cached] = (await groqService.ocrStructured(
      "truck_ownership",
      req,
      true
    )) as [GenericOcrStructuredResult, boolean];
    console.debug(
      `[OCR][handler] truck_ownership end ms=${Date.now() - start} cached=${cached}`
    );
    return { result, cached };
  },
  company_status: async (req) => {
    const start = Date.now();
    console.debug(`[OCR][handler] company_status start`);
    const [result, cached] = (await groqService.ocrStructured(
      "company_status",
      req,
      true
    )) as [GenericOcrStructuredResult, boolean];
    console.debug(
      `[OCR][handler] company_status end ms=${Date.now() - start} cached=${cached}`
    );
    return { result, cached };
  },
};
