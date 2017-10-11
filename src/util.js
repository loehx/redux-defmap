export function ensureSubState(state, stateKey) {
    if (!stateKey) {
        return state
    }

    let subState = state[stateKey]
    if (!subState) {
        subState = state[stateKey] = {}
    }

    return subState
}
