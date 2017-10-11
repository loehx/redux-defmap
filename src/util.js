export function ensureSubState(state, stateKey) {
    if (!stateKey) {
        return state;
    }

    const subState = state[stateKey];
    if (subState) {
        return subState;
    }

    return state[stateKey] = {};
}
