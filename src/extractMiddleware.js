import { ensureSubState } from './util'

function extractMiddleware(definitionMap, context, stateKey) {
    const filteredDefinitionMap = {}
    for (let k in definitionMap) {
        let { $before, $after, $middleware, $stateKey } = definitionMap[k]

        if ($before || $after || $middleware) {
            filteredDefinitionMap[k] = {
                $after,
                $before,
                $middleware,
                $stateKey: $stateKey || stateKey
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
        let state = store.getState()
        state = ensureSubState(state, stateKey)

        if ($before) {
            $before(context, state, action.payload)
        }

        const _next = function(action) {
            next(action)
            if ($after) {
                let state = store.getState()
                state = ensureSubState(state, stateKey)
                $after(context, state, action.payload)
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
