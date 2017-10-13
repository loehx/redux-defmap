import { applyMiddleware } from 'redux'
import extractActions from './extractActions'
import extractMiddleware from './extractMiddleware'
import extractReducer from './extractReducer'
import createStore from './store'

require('babel-polyfill')

export default function extractStore(defMapMap) {
    let actions = {}
    const middlewares = []
    const reducers = {}
    const initialState = {}

    for (let stateKey in defMapMap) {
        const defmap = defMapMap[stateKey]

        if (defmap.$state) {
            initialState[stateKey] = defmap.$state
            delete defmap['$state']
        }

        if (defmap.$reducer) {
            reducers[stateKey] = defmap.$reducer
            delete defmap['$reducer']
        } else {
            const r = extractReducer(defmap, stateKey)
            reducers[stateKey] = r
        }

        const a = extractActions(defmap)
        Object.assign(actions, a)

        if (defmap.$middleware) {
            middlewares.push(defmap.$middleware)
            delete defmap['$middleware']
        } else {
            const m = extractMiddleware(defmap, actions)
            if (m) {
                middlewares.push(m)
            }
        }
    }

    const store = createStore(reducers, initialState, applyMiddleware(...middlewares), actions)

    store.actions = actions

    return store
}
