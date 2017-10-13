# redux-defmap

[![Build State](https://travis-ci.org/loehx/redux-defmap.svg?branch=master)](https://travis-ci.org/loehx/redux-defmap) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/e852550356cc4f6aa542bc72895a19f3)](https://www.codacy.com/app/alexander.loehn/redux-defmap?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=loehx/redux-defmap&amp;utm_campaign=Badge_Grade) [![npm version](https://badge.fury.io/js/redux-defmap.svg)](https://badge.fury.io/js/redux-defmap)

Bring structure to redux applications

## Why?

* Actions, reducers and middleware in one file
* Action consts defined only once
* Clear structure / framework
* Payload validation

## Installation

```
npm install --save redux-defmap
```

## createStore

Create your store redux-like.

`store.js`
```js
import actions from './actions'
import actionDefinitions from './actionDefinitions';
import { extractActions, extractMiddleware, extractReducer, createStore, applyMiddleware } from 'redux-defmap'

const middleware = extractMiddleware(actionDefinitions, actions) // (context: actions)
const reducer = extractReducer(actionDefinitions)
const initialState = { }

export default createStore(reducer, initialState, applyMiddleware(middleware), actions);
```

`actions.js`
```js
import { extractActions } from 'redux-defmap'
import actionDefinitions from './actionDefinitions';

export default extractActions(actionDefinitions);
```

`actionDefinitions.js`
```js
import { isArray, isObject, isString, isBoolean, isDate, isNumber } from 'lodash';

export default {
    APP_START: {
        fireAppStart: () => null,
        $after: (context, state, payload) => { // (context: actions)
            context.showLogo();
        }
    },
    SHOW_LOGO: {
        showLogo: () => true,
        hideLogo: () => false,
        $validation: isBoolean,
        $reduce: (state, payload) => ({
            ...state,
            showLogo: payload
        })
    },
    SHOW_ERROR: {
        showError: (message) => ({
            message
        }),
        hideError: () => ({
            message: null
        }),
        $validation: {
            message: m => !m || isString(m) // can be empty or a string
        },
        $reduce: (state, payload) => ({
            ...state,
            showError: !!payload,
            errorMessage: payload
        })
    }
```
## extractStore

Create your store defmap-like.

```js
const store = extractStore({
    app: {
        // feature #1: Initial State
        $state: {
            count: 0
        }

        TEST: {
            test: a => ({ count: 1 }),

            $before: ...,
            $after: ...,

            $reduce: (state, payload) => ({
                ...state,
                count: payload.count
            })
        }
    },
    extra: {
        $state: { test: 1 },

        // feature #2: Extra Middleware
        $middleware: someMiddleware, // store => next => action => { ... }

        // feature #3: Extra Reducer
        $reducer: someReducer, //  // (state, action) => { ... }
    }
})
```

State before calling `store.actions.test()`
```
{
    app: {
        count: 0
    },
    extra: {
        test: 1
    }
}
```

State after calling `store.actions.test()`
```
{
    app: {
        count: 1
    },
    extra: {
        test: 1
    }
}
```

## extractActions

`extractActions(defmap: ActionDefinitionMap, dispatch: Function)`

* `defmap*` ActionDefinitionMap
* `dispatch` Function to receive the actions (e.g. store.dispatch) OPTIONAL

```js
// ActionDefinitionMap
{
    ACTION_NAME: {
        actionCreator1: (arg) => arg, // actionCreator2('hello') => { type: 'ACTION_NAME', payload: 'hello' },
        actionCreator2: (arg) => { arg }, // actionCreator2('hello') => { type: 'ACTION_NAME', payload: { arg: 'hello' } },
        actionCreator3: (arg1, arg2) => arg1 + arg2, // actionCreator3(1, 1) => { type: 'ACTION_NAME', payload: 2 },
        actionCreator4: () => null, // dispatches { type: 'ACTION_NAME' },
        actionCreator5: () => undefined, // dispatches NOTHING,

        // OPTIONAL meta information
        // { type: 'ACTION_NAME', payload: { ... }, meta: { someProperty: 'ANY' } },
        $meta: {
            someProperty: 'ANY'
        }
    }
}
```

`actions/app.js`

```js
export default {
    LOADING: {
        setLoading: (on) => ({
            show: on
        }),
        showLoading: () => ({
            show: true
        }),
        hideLoading: () => ({
            show: false
        })
        /* Add more functions here ... */
    },
}
```

`actions/index.js`

```js
import { extractActions } from 'redux-defmap';

import store from './store';
import app from './app';

export default extractActions(app, store.dispatch); // dispatch actions to store OPTIONAL
```

`some_file.js`
```js
import actions from './actions';

actions.showLoading(); // dispatches AND returns { type: 'LOADING', payload: { show: true } }
```

## extractReducer

`extractReducer(defmap: ReducerDefinitionMap)`

* `defmap*` ReducerDefinitionMap

```js
// ReducerDefinitionMap
{
    ACTION_NAME: {

        $reduce: (store, payload) => ({
            ...store
            // ...
        })

        // equals ...

        $reduce: (store, payload) => {
            return {
                ...store
                // ...
            }
        }

        // Payload validation (simple) OPTIONAL
        $validation: p => typeof p === 'string'
        // OK: { type: 'ACTION_NAME', payload: 'Hello World' }
        // OK: { type: 'ACTION_NAME', payload: '' }
        // BAD: { type: 'ACTION_NAME', payload: 12 }
        // BAD: { type: 'ACTION_NAME' }

        // Payload validation (complex) OPTIONAL
        $validation: {
            prop: p => typeof p === 'string'
        }
        // OK: { type: 'ACTION_NAME', payload: { prop: 'Hello World' } }
        // OK: { type: 'ACTION_NAME', payload: { prop: '' } }
        // BAD: { type: 'ACTION_NAME', payload: { prop: 12 } }
        // BAD: { type: 'ACTION_NAME', payload: null }
        // BAD: { type: 'ACTION_NAME' }
    }
}
```


## extractMiddleware

`extractMiddleware(defmap: MiddlewareDefinitionMap, context: any, stateKey: string)`

* `defmap*` MiddlewareDefinitionMap
* `context` Any kind of value that gets simply passed to the events $before and $after (You should put in the actions here)
* `stateKey` String that defines a partial state (e.g. 'app', 'router', ... | influences the 'state' variable in the event callbacks $before and $after)

```js
// MiddlewareDefinitionMap
{
    ACTION_NAME: {

        // Before reducing OPTIONAL
        $before: (context, state, payload) => {
            // Do something
        }

        // After reducing OPTIONAL
        $after: (context, state, payload) => {
            // Do something (e.g. call other actions)
        }

    }
}
```

# License

MIT © 2017 Alexander Löhn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
