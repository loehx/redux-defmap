import { createStore, applyMiddleware, combineReducers } from 'redux'

function Store(reducers, initialState, enhancer, actions) {
    if (typeof enhancer === 'object' && enhancer.length) {
        enhancer = applyMiddleware(...enhancer)
    }

    if (typeof reducers === 'object') {
        reducers = combineReducers(reducers)
    }

    const store = createStore(reducers, initialState, enhancer)

    actions.$dispatch = store.dispatch

    return store
}

export default Store
