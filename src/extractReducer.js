import validatePayload from './validatePayload'

export default function extractReducer(definitionMap) {
    return function(state = {}, action) {
        const { type, payload } = action
        const definition = definitionMap[type]

        if (!definition || !definition.$reduce) {
            return state
        }

        if (definition.$validation) {
            validatePayload(definition.$validation, type, payload)
        }

        return definition.$reduce(state, payload)
    }
}
