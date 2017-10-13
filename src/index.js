import { combineReducers, compose as reduxCompose, applyMiddleware, connect } from 'redux'
import extractActions from './extractActions'
import extractReducer from './extractReducer'
import extractMiddleware from './extractMiddleware'
import extractStore from './extractStore'
import createStore from './store'

// eslint-disable no-underscore-dangle
const compose = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || reduxCompose
// eslint-enable

export {
    extractActions,
    extractReducer,
    extractMiddleware,
    combineReducers,
    createStore,
    extractStore,
    compose,
    applyMiddleware,
    connect
}
