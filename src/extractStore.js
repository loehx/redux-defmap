import { applyMiddleware } from 'redux'
import extractActions from './extractActions'
import extractMiddleware from './extractMiddleware'
import extractReducer from './extractReducer'
import createStore from './store'

require('babel-polyfill')

export default function extractStore(defMapMap) {
    let actions = {}
    const initialState = {}
    const reducers = {}
    const middlewares = []
    const enhancers = []

    for (let stateKey in defMapMap) {
        const defmap = defMapMap[stateKey]

        if (typeof defmap !== 'object' || stateKey.toUpperCase() === stateKey) {
            throw Error('[REDUX-JEDI] Every definition map needs to be wrapped in a state key.')
        }

        if (defmap.hasOwnProperty('$state')) {
            initialState[stateKey] = defmap.$state
            delete defmap['$state']
        }

        if (defmap.hasOwnProperty('$reducer')) {
            reducers[stateKey] = defmap.$reducer
            delete defmap['$reducer']
        } else {
            const r = extractReducer(defmap, stateKey)
            reducers[stateKey] = r
        }

        if (defmap.$enhancer) {
            enhancers.push(defmap.$enhancer)
            delete defmap['$enhancer']
        }

        if (defmap.$middleware) {
            middlewares.push(defmap.$middleware)
            delete defmap['$middleware']
        } else {
            const m = extractMiddleware(defmap, actions)
            if (m) {
                middlewares.push(m)
            }
        }

        const a = extractActions(defmap)
        Object.assign(actions, a)
    }

    enhancers.push(applyMiddleware(...middlewares))

    const store = createStore(reducers,
        initialState,
        enhancers,
        actions)

    store.actions = actions

    return store
}
