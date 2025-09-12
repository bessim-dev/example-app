export type OcrType =
  | "car-plate"
  | "driving_permit"
  | "kbis"
  | "responsibility_insurance"
  | "vigilance_certificate"
  | "rib"
  | "wcarh"
  | "truck_ownership"
  | "company_status";

export interface OcrRequest {
  image?: string;
  images?: string[];
  fields?: string[];
}

// Existing car plate OCR result (kept for backward compatibility)
export interface OcrResult {
  plate: string | null;
  plate_confidence: number;
  country: string | null;
  country_confidence: number;
  region: string | null;
  region_confidence: number;
}

export type StructuredFieldValue = { value: unknown; confidence: number };

export interface GenericOcrStructuredResult {
  doc_type: string;
  fields: Record<string, StructuredFieldValue | StructuredFieldValue[] | unknown>;
  derived?: Record<string, unknown>;
  pages_seen?: number;
}
