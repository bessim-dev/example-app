import type { GenericOcrStructuredResult } from "@/types/ocr";
import { DRIVING_PERMIT_COUNTRY_RULES, Iso2, isSupportedCountry, validatePermitNumber } from "@/lib/ocr/country-rules";

type Field = { value: unknown; confidence: number } | undefined;

function getField(result: GenericOcrStructuredResult, name: string): Field {
    const f = (result.fields as Record<string, unknown>)[name];
    if (!f || typeof f !== "object") return undefined;
    const maybe = f as { value?: unknown; confidence?: unknown };
    if (typeof maybe.confidence !== "number") return undefined;
    return { value: maybe.value, confidence: maybe.confidence } as { value: unknown; confidence: number };
}

function setField(result: GenericOcrStructuredResult, name: string, value: unknown, confidence: number): void {
    const fields = (result.fields as Record<string, unknown>) || {};
    fields[name] = { value, confidence };
    (result as any).fields = fields;
}

export function postProcessDrivingPermit(result: GenericOcrStructuredResult): GenericOcrStructuredResult {
    // Expect issuing_country_iso2 field in model output
    const countryField = getField(result, "issuing_country_iso2");
    const permitField = getField(result, "permit_number");

    const derived: Record<string, unknown> = { ...(result.derived ?? {}) };

    const iso2Raw = (countryField?.value as string | null) ?? null;
    const iso2 = iso2Raw ? String(iso2Raw).toUpperCase() : null;

    if (!isSupportedCountry(iso2)) {
        derived["validation"] = {
            country_supported: false,
            reason: "unsupported-country",
            normalized_permit_number: null,
            permit_number_valid: null,
            strategy: "none",
        };
        return { ...result, derived };
    }

    const countryRules = DRIVING_PERMIT_COUNTRY_RULES[iso2];
    const raw = (permitField?.value as string | null) ?? null;
    if (!raw || typeof raw !== "string" || !raw.trim()) {
        derived["validation"] = {
            country_supported: true,
            reason: "no-permit-number",
            normalized_permit_number: null,
            permit_number_valid: false,
            strategy: "model-empty",
        };
        return { ...result, derived };
    }

    const { valid, normalized, reason } = validatePermitNumber(iso2, raw);

    let adjustedConfidence = permitField?.confidence ?? 0;
    if (valid) {
        // raise confidence modestly when validation passes
        adjustedConfidence = Math.min(1, adjustedConfidence + 0.15);
    } else {
        // penalize failed validation
        adjustedConfidence = Math.max(0, adjustedConfidence - 0.2);
    }

    // Update the field with normalized format if valid
    if (valid) {
        setField(result, "permit_number", normalized, adjustedConfidence);
    } else {
        // Keep original but with adjusted confidence
        setField(result, "permit_number", raw, adjustedConfidence);
    }

    derived["validation"] = {
        country_supported: true,
        normalized_permit_number: valid ? normalized : null,
        permit_number_valid: valid,
        reason: valid ? "ok" : reason ?? "unknown",
        strategy: "postprocess-validate-normalize",
    };

    return { ...result, derived };
}


