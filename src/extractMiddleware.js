function extractMiddleware(definitionMap, context, stateKey) {
    const filteredDefinitionMap = {}
    for (let k in definitionMap) {
        let { $before, $after, $middleware } = definitionMap[k]

        if ($before || $after || $middleware) {
            filteredDefinitionMap[k] = {
                $after,
                $before,
                $middleware
            }
        }
    }

    if (Object.keys(filteredDefinitionMap).length === 0) {
        return null // No events found
    }

    const func = store => next => action => {
        const definition = filteredDefinitionMap[action.type]
        if (!definition) return next(action)

        const { $before, $after, $middleware } = definition
        const state = store.getState()

        if ($before) {
            $before(context, state, action.payload)
        }

        const _next = function(action) {
            next(action)
            if ($after) {
                $after(context, store.getState(), action.payload)
            }
        }

        if ($middleware) {
            $middleware(state, _next, action)
        } else {
            _next(action)
        }
    }

    return func
}

export default extractMiddleware
