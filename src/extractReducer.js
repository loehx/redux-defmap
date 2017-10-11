import validatePayload from './validatePayload';
import { ensureSubState } from './util';

export default function extractReducer(definitionMap) {
    return function(state = {}, action) {
        const { type, payload } = action;
        const definition = definitionMap[type];

        if (!definition || !definition.$reduce) {
            return state;
        }

        if (definition.$validation) {
            validatePayload(definition.$validation, type, payload);
        }

        state = ensureSubState(state, definition.$stateKey);

        return definition.$reduce(state, payload);
    };
}
