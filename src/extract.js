export default (name, spec, actionMap, middlewares, reducerMap, enhancers, initialState, dispatch) => {

    if (spec.$state) {
        initialState[name] = spec.$state
    }

    for (let type in spec) {
        const d = spec[type]
        if (!d.$actions) continue

        for (let actionName in d.$actions) {
            if (actionName[0] === '$') continue
            actionMap[actionName] = function(...args) {
                dispatch({
                    type,
                    payload: d.$actions[actionName](...args)
                })
            }
        }
    }

    if (spec.$middleware) {
        middlewares.push(spec.$middleware)
    }
    if (spec.$enhancer) {
        enhancers.push(spec.$enhancer)
    }

    middlewares.push(store => next => action => {
        const d = spec[action.type]

        if (!d || !d.$middleware) {
            return next(action)
        }
        store.actions = actionMap
        d.$middleware(store, next, action)
    })

    reducerMap[name] = spec.$reducer || ((state = {}, action) => {
        const { type, payload } = action
        const d = spec[type]

        if (!d || !d.$reducer) {
            return state
        }

        return d.$reducer(state, payload)
    })
}
