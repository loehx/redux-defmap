import { createStore, compose, applyMiddleware, combineReducers } from 'redux';

// eslint-disable no-underscore-dangle
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
// eslint-enable

function Store(reducers, initialState, middleware, actions) {

    if (typeof middleware === 'object' && middleware.length) {
        middleware = applyMiddleware(...middleware);
    } else if (typeof middleware === 'function') {
        middleware = applyMiddleware(middleware);
    }

    if (middleware) {
        middleware = composeEnhancers(middleware);
    }

    if (typeof reducers === 'object') {
        reducers = combineReducers(reducers);
    }

    const store = createStore(reducers, initialState, middleware);

    actions.$dispatch = store.dispatch;

    return store;
}

export default Store;
