export type Iso2 = "FR" | "BE" | "DE";

export interface PermitNumberRule {
    regexes: RegExp[];
    normalize: (input: string) => string;
    anchors?: string[];
    canonicalize?: (normalized: string) => string;
    hasChecksum?: boolean;
    checksumValid?: (normalized: string) => boolean;
    minLength?: number;
    maxLength?: number;
}

export interface CountryRules {
    iso2: Iso2;
    driving_permit: PermitNumberRule;
}

function defaultNormalize(value: string): string {
    return value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

// NOTE: Initial pragmatic patterns. Refine with real samples.
const FR_RULE: CountryRules = {
    iso2: "FR",
    driving_permit: {
        // French permits can vary (older vs newer). Start broad (9-16 alphanum).
        regexes: [/^[A-Z0-9]{9,16}$/],
        normalize: defaultNormalize,
        anchors: [
            "Numéro du permis",
            "N° permis",
            "Numéro de permis",
            "Permis n°",
        ],
        minLength: 9,
        maxLength: 16,
    },
};

const BE_RULE: CountryRules = {
    iso2: "BE",
    driving_permit: {
        // Belgian formats often numeric. Start narrower: 9-12 digits.
        regexes: [/^[0-9]{9,12}$/],
        normalize: defaultNormalize,
        anchors: [
            "Rijbewijsnummer",
            "Numéro du permis",
            "Nummer rijbewijs",
        ],
        minLength: 9,
        maxLength: 12,
    },
};

const DE_RULE: CountryRules = {
    iso2: "DE",
    driving_permit: {
        // German formats: alphanum, start broad: 8-14 alphanum.
        regexes: [/^[A-Z0-9]{8,14}$/],
        normalize: defaultNormalize,
        anchors: [
            "Führerscheinnummer",
            "Fuehrerscheinnummer",
            "FS-Nr",
            "Führerschein Nr.",
        ],
        minLength: 8,
        maxLength: 14,
    },
};

export const DRIVING_PERMIT_COUNTRY_RULES: Record<Iso2, CountryRules> = {
    FR: FR_RULE,
    BE: BE_RULE,
    DE: DE_RULE,
};

export function isSupportedCountry(iso2: string | null | undefined): iso2 is Iso2 {
    if (!iso2) return false;
    const u = iso2.toUpperCase();
    return u === "FR" || u === "BE" || u === "DE";
}

export function validatePermitNumber(iso2: Iso2, rawValue: string): {
    valid: boolean;
    normalized: string;
    reason?: string;
} {
    const rules = DRIVING_PERMIT_COUNTRY_RULES[iso2].driving_permit;
    const normalized = rules.normalize(rawValue);
    if (!normalized.length) {
        return { valid: false, normalized, reason: "empty-after-normalize" };
    }
    if (
        (typeof rules.minLength === "number" && normalized.length < rules.minLength) ||
        (typeof rules.maxLength === "number" && normalized.length > rules.maxLength)
    ) {
        return { valid: false, normalized, reason: "length-out-of-range" };
    }
    const matches = rules.regexes.some((rx) => rx.test(normalized));
    if (!matches) {
        return { valid: false, normalized, reason: "no-regex-match" };
    }
    if (rules.hasChecksum && rules.checksumValid && !rules.checksumValid(normalized)) {
        return { valid: false, normalized, reason: "checksum-failed" };
    }
    return { valid: true, normalized };
}


