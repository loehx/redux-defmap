export default function validatePayload(validation, name, payload) {
    if (typeof validation === 'function') {
        if (!validation(payload)) {
            return console.error('[BODY_VALIDATION_FAILED] ', definition, payload);
        }
    } else /* typeof $validation === 'object' */ {
        if (typeof payload !== 'object') {
            return console.error('[MISSING_BODY] Action: ' + name, validation, payload);
        }

        const errors = Object.keys(validation)
            .map(k => ({
                key: k,
                value: payload[k],
                $valid: validation[k](payload[k])
            }))
            .filter(a => !a.$valid);

        if (errors.length) {
            console.error('[ACTION_VALIDATION] Failed for ' + errors.length + ' prop(s) in action: ' + name, errors, definition);

            const missingPayload = {};
            errors.forEach(e => {
                missingPayload[e.key] = typeof e.value === 'undefined' ? 'undefined' : e.value;
            });
            console.log(JSON.stringify(missingPayload, null, 4));
            console.log(JSON.stringify(payload, null, 4));
        }
    }
}
