export function parseLooseJSON(value) {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    try {
        return JSON.parse(trimmed);
    } catch (err) {
        // Allow JS-style object literals without quoted keys/values
    }

    const normalized = trimmed
        .replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":')
        .replace(/:\s*([^"\[{][^,\]}]*)(?=(,|\}|\]))/g, (match, token) => {
            const cleaned = token.trim();
            if (/^(true|false|null|-?\d+(\.\d+)?([eE][+-]?\d+)?)$/.test(cleaned)) {
                return `: ${cleaned}`;
            }
            return `: "${cleaned.replace(/"/g, '\\"')}"`;
        });

    try {
        return JSON.parse(normalized);
    } catch (err) {
        console.error('Loose JSON parse failed for fund_source:', err, value);
        return null;
    }
}

export function validateFundSource(value) {
    const parsed = parseLooseJSON(value);
    return parsed ? JSON.stringify(parsed) : null;
}

export function normalizeLooseJSON(value) {
    return parseLooseJSON(value);
}

export function isValidJSON(value) {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (!trimmed) return false;

    try {
        JSON.parse(trimmed);
        return true;
    } catch (err) {
        return false;
    }
}

export function validateJSON(value, strict = false) {
    if (typeof value !== 'string') {
        return { valid: false, error: 'Value is not a string', value: null };
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return { valid: false, error: 'Empty string', value: null };
    }

    try {
        const parsed = JSON.parse(trimmed);
        return { valid: true, error: null, value: parsed };
    } catch (err) {
        if (strict) {
            return { valid: false, error: err.message, value: null };
        }

        try {
            const parsed = parseLooseJSON(trimmed);
            if (parsed === null) {
                return { valid: false, error: 'Failed to parse loose JSON', value: null };
            }
            return { valid: true, error: null, value: parsed, loose: true };
        } catch (looseErr) {
            return { valid: false, error: looseErr.message, value: null, loose: true };
        }
    }
}