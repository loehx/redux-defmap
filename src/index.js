import { combineReducers } from 'redux';
import extractActions from './extractActions';
import extractReducer from './extractReducer';
import extractMiddleware from './extractMiddleware';
import createStore from './store';

export { extractActions, extractReducer, extractMiddleware, combineReducers, createStore };
