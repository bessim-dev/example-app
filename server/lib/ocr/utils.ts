import type { OcrType, OcrRequest, GenericOcrStructuredResult } from "@/types/ocr";
import { createHash } from "crypto";

export function normalizeImages(input: OcrRequest): string[] {
    if (Array.isArray(input.images) && input.images.length > 0) return input.images;
    if (input.image) return [input.image];
    return [];
}

export function buildPrompt(basePrompt: string, fields?: string[]): string {
    if (!fields || fields.length === 0) return basePrompt;
    const extra = `\nWhen populating the 'fields' object, only include the following keys if present in the document: ${fields
        .map((f) => `'${f}'`)
        .join(", ")}. If a requested key is not found, include it with {"value": null, "confidence": 0}.`;
    return basePrompt + extra;
}

export function hashImages(images: string[], ocrType: OcrType, fields?: string[]): string {
    const h = createHash("sha256");
    for (const img of images) h.update(img);
    if (fields && fields.length) h.update(fields.sort().join("|"));
    return `${ocrType}:${h.digest("hex")}`;
}

export function filterResultFields(
    result: GenericOcrStructuredResult,
    fields?: string[]
): GenericOcrStructuredResult {
    if (!fields || fields.length === 0) return result;
    const requested = new Set(fields);
    const filteredFields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(result.fields ?? {})) {
        if (requested.has(key)) filteredFields[key] = value;
    }
    return { ...result, fields: filteredFields };
}

export function getTodayIsoUTC(): string {
    const d = new Date();
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

