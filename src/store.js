import { createStore, combineReducers } from 'redux'

function Store(reducers, initialState, enhancer, actions) {
    /* eslint-disable no-underscore-dangle */
    if (typeof window === 'object' && typeof window['__REDUX_DEVTOOLS_EXTENSION__'] === 'function') {
        enhancer = window['__REDUX_DEVTOOLS_EXTENSION__']()(enhancer)
    }
    /* eslint-enable */

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
