import extract from './extract'

export default (redux, specMap, devToolsOptions) => {
    const { createStore, combineReducers, applyMiddleware, compose } = redux
    const initialState = {}
    const actions = {}
    const reducers = {}
    const middlewares = []
    const enhancers = []
    let store = null

    for (let name in specMap) {
        const spec = specMap[name]

        if (typeof spec !== 'object' || name.toUpperCase() === name) {
            throw Error('[REDUX-JEDI] Every specification needs to be wrapped in a state key.')
        }

        extract(name,
            spec,
            actions,
            middlewares,
            reducers,
            enhancers,
            initialState,
            (action) => store.dispatch(action))
    }

    enhancers.push(applyMiddleware(...middlewares))

    /* eslint-disable no-underscore-dangle */
    const composeEnhancers =
        typeof window === 'object' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'](devToolsOptions || {}) : compose
    /* eslint-enable */

    store = createStore(
        combineReducers(reducers),
        initialState,
        composeEnhancers(...enhancers))

    store.actions = actions

    return store
}
