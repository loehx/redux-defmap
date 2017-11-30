import { createStore, combineReducers, compose } from 'redux'

function Store(reducers, initialState, enhancers, actions) {
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers =
        typeof window === 'object' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({}) : compose
    /* eslint-enable */

    if (typeof reducers === 'object') {
        reducers = combineReducers(reducers)
    }

    const store = createStore(reducers, initialState, composeEnhancers(...enhancers))

    for (let k in actions) {
        if (actions[k].definition) {
            actions[k].definition.$dispatch = store.dispatch
        }
    }

    return store
}

export default Store
