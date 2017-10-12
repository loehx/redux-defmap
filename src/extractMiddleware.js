import { ensureSubState } from './util'

function extractMiddleware(definitionMap, context, stateKey) {
    const filteredDefinitionMap = {}
    for (let k in definitionMap) {
        let { $before, $after, $stateKey } = definitionMap[k]

        if (typeof $before === 'function' || typeof $after === 'function') {
            filteredDefinitionMap[k] = {
                $after,
                $before,
                $stateKey
            }
        }
    }

    if (Object.keys(filteredDefinitionMap).length === 0) {
        console.warn('[DEFMAP] No events found for creating a middleware.', definitionMap)
    }

    const func = store => next => action => {
        const definition = filteredDefinitionMap[action.type]
        if (!definition) return next(action)

        if (definition.$before) {
            let state = store.getState()
            state = ensureSubState(state, stateKey)
            definition.$before(context, state, action.payload)
        }

        next(action)

        if (definition.$after) {
            let state = store.getState()
            state = ensureSubState(state, stateKey)
            definition.$after(context, state, action.payload)
        }
    }

    return func
}

export default extractMiddleware
