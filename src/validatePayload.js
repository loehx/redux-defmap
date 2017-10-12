export default function validatePayload(validation, name, payload) {
    if (typeof validation === 'function') {
        if (!validation(payload)) {
            throw Error('[DEFMAP] Payload validation failed for action: ' + name, payload)
        }
    } else /* typeof $validation === 'object' */ {
        if (typeof payload !== 'object') {
            return console.error('[DEFMAP] Missing payload in action: ' + name, validation, payload)
        }

        const errors = Object.keys(validation)
            .map(k => ({
                key: k,
                value: payload[k],
                $valid: validation[k](payload[k])
            }))
            .filter(a => !a.$valid)

        if (errors.length) {
            const error = new Error('[DEFMAP] Payload validation failed for ' + errors.length + ' prop(s) in action: ' + name, errors)

            error.validation = {}
            errors.forEach(e => {
                error.validation[e.key] = typeof e.value === 'undefined' ? 'undefined' : e.value
            })

            error.validation = JSON.stringify(validation, null, 4)
            error.payload = JSON.stringify(payload, null, 4)

            throw error
        }
    }
}
