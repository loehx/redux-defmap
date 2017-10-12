export default function extractActions(definitionMap, dispatch) {
    const actions = {}
    const start = new Date()

    for (let k in definitionMap) {
        const definition = definitionMap[k]
        const actionNames = Object.keys(definition)
            .concat(definition.$actionName)
            .filter(k => k && k[0] !== '$')

        if (actionNames.length === 0) {
            continue
        }

        actionNames.forEach(actionName => {
            if (actions[actionName]) {
                console.warn('[DEFMAP] Duplicate action key: ' + actionName)
            }

            const getPayload = definition[actionName] || definition.$getPayload
            actions[actionName] = getActionCaller(k, definition, actions, getPayload)
            actions[actionName].definition = definition
        })

        if (dispatch) {
            actions.$dispatch = dispatch
        }
    }

    // Warn user if there were no actions found
    const count = Object.keys(actions).length - 1
    if (count === 0) { console.error('[DEFMAP] No actions extracted from object.', JSON.stringify(definitionMap)) }

    // Warn user if creation took more than 20 ms
    const took = new Date() - start
    if (took > 20) {
        console.warn(`[DEFMAP] Created ${count} actions in ${took} ms`)
    }

    return actions
}

function getActionCaller(name, definition, actions, getPayload) {
    const { $meta } = definition

    if (name !== name.toUpperCase()) {
        console.error('[DEFMAP] Action names should be UPPER CASE:', JSON.stringify(name))
    }
    if (getPayload && typeof getPayload !== 'function') {
        console.error('[DEFMAP] Payload getter should be a function:', JSON.stringify(definition))
    }

    if (!getPayload) {
        getPayload = args => args || null
    }

    return function(...args) {
        const payload = getPayload(...args)
        if (payload === undefined) {
            return null
        }

        const action = {
            type: name
        }

        if (payload !== null) {
            action.payload = payload
        }

        if ($meta) {
            action.meta = $meta
        }

        Object.freeze(action)

        if (actions.$dispatch) {
            actions.$dispatch(action)
        }

        return action
    }
}
