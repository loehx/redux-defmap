import { combineReducers, compose as reduxCompose, applyMiddleware, connect } from 'redux'
import extractActions from './extractActions'
import extractReducer from './extractReducer'
import extractMiddleware from './extractMiddleware'
import extractStore from './extractStore'

export {
    extractActions,
    extractReducer,
    extractMiddleware,
    extractStore
}
