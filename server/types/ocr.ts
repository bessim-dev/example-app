export type OcrType = "car-plate" | "id" | "receipt" | "invoice";

export interface OcrRequest {
  image: string;
}

export interface OcrResult {
  plate: string | null;
  plate_confidence: number;
  country: string | null;
  country_confidence: number;
  region: string | null;
  region_confidence: number;
}
