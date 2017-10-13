import { createStore, applyMiddleware, combineReducers } from 'redux'

function Store(reducers, initialState, enhancer, actions) {
    if (typeof enhancer === 'object' && enhancer.length) {
        enhancer = applyMiddleware(...enhancer)
    }

    if (typeof reducers === 'object') {
        reducers = combineReducers(reducers)
    }

    const store = createStore(reducers, initialState, enhancer)

    for (let k in actions) {
        if (actions[k].definition) {
            actions[k].definition.$dispatch = store.dispatch
        }
    }

    return store
}

export default Store
