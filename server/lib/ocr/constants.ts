import type { OcrType } from "@/types/ocr";

// Prompts per document type. Keep concise but strict on JSON output.
export const OCR_PROMPTS: Record<Exclude<OcrType, "car-plate">, string> = {
  driving_permit: `Extract structured data from a Driving Permit provided as 1 or 2 images (front/back). Return ONLY a single JSON object, no markdown. Use {current_date} (UTC) for derived values.

Schema:
{
  "doc_type": "driving_permit",
  "fields": {
    "has_front_image": {"value": <boolean>, "confidence": <0..1>},
    "has_back_image": {"value": <boolean>, "confidence": <0..1>},
    "permit_number": {"value": <string|null>, "confidence": <0..1>},
    "issuing_country_iso2": {"value": <string|null>, "confidence": <0..1>},
    "holder_last_name": {"value": <string|null>, "confidence": <0..1>},
    "holder_first_name": {"value": <string|null>, "confidence": <0..1>},
    "date_of_birth": {"value": <YYYY-MM-DD|null>, "confidence": <0..1>},
    "issue_date": {"value": <YYYY-MM-DD|null>, "confidence": <0..1>},
    "expiry_date": {"value": <YYYY-MM-DD|null>, "confidence": <0..1>},
    "license_categories": {
      "value": [{"category": <string>, "expiry_date": <YYYY-MM-DD|null>, "confidence": <0..1>}],
      "confidence": <0..1>
    }
  },
  "derived": {
    "is_valid": <boolean|null>,
    "validity_reason": <string|null>,
    "days_until_expiry": <integer|null>
  },
  "pages_seen": <integer>
}

Rules:
- Dates in YYYY-MM-DD. Country ISO2 like "FR".
- If any field not found, set value=null and confidence=0.
- is_valid = expiry_date >= {current_date} when available, else null.
- days_until_expiry = difference in days between {current_date} and expiry_date, else null.
- When extracting permit_number, prefer a value that appears on both sides (front/back). If multiple candidates, choose the one that best matches the issuing_country_iso2 format conventions. Normalize by removing spaces and hyphens and uppercasing letters. If unsure, return the best candidate with confidence reflecting uncertainty.`,

  kbis: `Extract structured data from a KBIS (France). Return ONLY JSON, no markdown. Use {current_date}.
{
  "doc_type": "kbis",
  "fields": {
    "company_name": {"value": <string|null>, "confidence": <0..1>},
    "siren": {"value": <string|null>, "confidence": <0..1>},
    "siret": {"value": <string|null>, "confidence": <0..1>},
    "rcs_city": {"value": <string|null>, "confidence": <0..1>},
    "company_address": {"value": <string|null>, "confidence": <0..1>},
    "kbis_issue_date": {"value": <YYYY-MM-DD|null>, "confidence": <0..1>}
  },
  "derived": {
    "is_valid": <boolean|null>,
    "validity_reason": <string|null>,
    "days_until_expiry": <integer|null>
  },
  "pages_seen": <integer>
}`,

  responsibility_insurance: `Extract structured data from a responsibility insurance document. Return ONLY JSON, no markdown. Use {current_date}.
{
  "doc_type": "responsibility_insurance",
  "fields": {
    "insurer_name": {"value": <string|null>, "confidence": <0..1>},
    "policy_number": {"value": <string|null>, "confidence": <0..1>},
    "insured_name_or_company": {"value": <string|null>, "confidence": <0..1>},
    "coverage_type": {"value": <string|null>, "confidence": <0..1>},
    "start_date": {"value": <YYYY-MM-DD|null>, "confidence": <0..1>},
    "expiration_date": {"value": <YYYY-MM-DD|null>, "confidence": <0..1>}
  },
  "derived": {
    "is_valid": <boolean|null>,
    "validity_reason": <string|null>,
    "days_until_expiry": <integer|null>
  },
  "pages_seen": <integer>
}`,

  vigilance_certificate: `Extract structured data from a vigilance certificate (France). Return ONLY JSON, no markdown. Use {current_date}.
{
  "doc_type": "vigilance_certificate",
  "fields": {
    "certificate_number": {"value": <string|null>, "confidence": <0..1>},
    "issuing_body": {"value": <string|null>, "confidence": <0..1>},
    "creation_date": {"value": <YYYY-MM-DD|null>, "confidence": <0..1>}
  },
  "derived": {
    "is_valid": <boolean|null>,
    "validity_reason": <string|null>,
    "days_until_expiry": <integer|null>
  },
  "pages_seen": <integer>
}`,

  rib: `Extract structured data from a French RIB. Return ONLY JSON, no markdown.
{
  "doc_type": "rib",
  "fields": {
    "iban": {"value": <string|null>, "confidence": <0..1>},
    "bic": {"value": <string|null>, "confidence": <0..1>},
    "account_holder_name": {"value": <string|null>, "confidence": <0..1>},
    "bank_name": {"value": <string|null>, "confidence": <0..1>}
  },
  "derived": {
    "is_valid": <boolean|null>,
    "validity_reason": <string|null>,
    "days_until_expiry": null
  },
  "pages_seen": <integer>
}`,

  wcarh: `Extract structured data about WCARH presence and any credit card details. Return ONLY JSON, no markdown.
{
  "doc_type": "wcarh",
  "fields": {
    "has_wcarh_document": {"value": <boolean>, "confidence": <0..1>},
    "cardholder_name": {"value": <string|null>, "confidence": <0..1>},
    "card_brand": {"value": <string|null>, "confidence": <0..1>},
    "card_last4": {"value": <string|null>, "confidence": <0..1>},
    "card_exp_month": {"value": <number|null>, "confidence": <0..1>},
    "card_exp_year": {"value": <number|null>, "confidence": <0..1>}
  },
  "derived": {
    "is_valid": <boolean|null>,
    "validity_reason": <string|null>,
    "days_until_expiry": null
  },
  "pages_seen": <integer>
}`,

  truck_ownership: `Extract structured data indicating truck ownership. Return ONLY JSON, no markdown.
{
  "doc_type": "truck_ownership",
  "fields": {
    "owns_truck": {"value": <boolean>, "confidence": <0..1>},
    "vehicle_registration_number": {"value": <string|null>, "confidence": <0..1>},
    "plate_country_iso2": {"value": <string|null>, "confidence": <0..1>}
  },
  "derived": {
    "is_valid": <boolean|null>,
    "validity_reason": <string|null>,
    "days_until_expiry": null
  },
  "pages_seen": <integer>
}`,

  company_status: `Extract structured data about professional status and DVR requirement. Return ONLY JSON, no markdown.
{
  "doc_type": "company_status",
  "fields": {
    "status": {"value": <"company"|"entrepreneur"|null>, "confidence": <0..1>},
    "dvr_document_present": {"value": <boolean|null>, "confidence": <0..1>}
  },
  "derived": {
    "is_valid": <boolean|null>,
    "validity_reason": <string|null>,
    "days_until_expiry": null
  },
  "pages_seen": <integer>
}`,
};

export const JSON_MODE = { type: "json_object" } as const;
export const DEFAULT_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
export const DEFAULT_TEMPERATURE = 0.2;
export const DEFAULT_MAX_TOKENS = 1024;

