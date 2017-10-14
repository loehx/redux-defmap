export default function extractActions(definitionMap, dispatch) {
    const actions = {}

    for (let k in definitionMap) {
        const definition = definitionMap[k]
        const actionNames = Object.keys(definition)
            .concat(definition.$actionName)
            .filter(k => k && k[0] !== '$')

        if (actionNames.length === 0) {
            continue
        }

        if (dispatch) {
            definition.$dispatch = dispatch
        }

        actionNames.forEach(actionName => {
            if (actions[actionName]) {
                throw new Error('[REDUX-JEDI] Duplicate action key: ' + actionName)
            }

            const getPayload = definition[actionName] || definition.$getPayload
            actions[actionName] = getActionCaller(k, definition, actions, getPayload)
            actions[actionName].definition = definition
        })
    }

    // Warn user if there were no actions found
    if (!Object.keys(actions).length) {
        return null
    }

    return actions
}

function getActionCaller(name, definition, actions, getPayload) {
    const { $meta } = definition

    if (name !== name.toUpperCase()) {
        throw new Error('[REDUX-JEDI] Action names should be UPPER CASE:', JSON.stringify(name))
    }
    if (getPayload && typeof getPayload !== 'function') {
        throw new Error('[REDUX-JEDI] Payload getter should be a function:', JSON.stringify(definition))
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

        if (definition.$dispatch) {
            definition.$dispatch(action)
        }

        return action
    }
}
