# redux-jedi

[![Build State](https://travis-ci.org/loehx/redux-jedi.svg?branch=master)](https://travis-ci.org/loehx/redux-jedi) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/d60681fea1374aaa8f7d4c20ceac5a0f)](https://www.codacy.com/app/loehx/redux-defmap?utm_source=github.com&utm_medium=referral&utm_content=loehx/redux-defmap&utm_campaign=Badge_Grade) [![npm version](https://badge.fury.io/js/redux-jedi.svg)](https://badge.fury.io/js/redux-jedi) [![Coverage Status](https://coveralls.io/repos/github/loehx/redux-defmap/badge.svg)](https://coveralls.io/github/loehx/redux-defmap)

_"FIGHT COMPLEXITY!" - Jedi Cat_

![Jedi Cat](readme/jedi-cat.gif)

## Why?

- Actions, reducers and middleware in one file
- Action consts defined only once
- Clear structure
- Automatically connects to [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)

## Installation

```
npm install --save redux-jedi
```

## Structure

```js
{
    stateKey: {

        $state: { ... },

        ACTION_TYPE: {
            $actions: {
                actionCreator: (...) => ({ ... }),
            },
            $middleware: (store, next, action) => { ... },
            $reducer: (state, payload) => ({ ...state, ... }),
        },
        ...
    }
    ...
}
```

### Usage

Let's call this a `jediSpec`

```javascript
{
    todos: {

        $state: [],

        ADD_TODO: {
            $actions: {
                addTodo: (text) => ({
                    id: new Date().getTime(),
                    text
                }),
            },
            $middleware: (store, next, action) => {
                if (!action.payload.text) {
                    store.actions.showAlert('Please enter a text first.');
                } else {
                    next(action);
                    store.actions.showSuccess('Todo added successfully.');
                }
            },
            $reducer: (state, payload) => [...state, payload],
        },

        REMOVE_TODO: {
            $actions: {
                removeTodo: (id) => ({ id }),
            },
            $middleware: (store, next, action) => {
                const countBefore = store.getState().todos.length;
                next(action);
                if (countBefore === store.getState().todos.length) {
                    store.actions.showAlert('Todo could not be found by ID: ' + action.payload.id);
                } else {
                    store.actions.showSuccess('Todo has been removed successfully.');
                }
            },
            $reducer: (state, { id }) => state.filter(t => t.id !== id),
        },
    }
    ...
}
```

# Setup

```js
import * as redux from 'redux';
import { initializeCurrentLocation } from 'redux-little-router';
import { extractStore } from 'redux-jedi';
import { enhancer as routerEnhancer, reducer as routerReducer, middleware as routerMiddleware } from './router';

import app from './actions/app';
import account from './actions/account';
import $fetch from './middleware/$fetch';

const store = extractStore(redux, {
    router: {
        $reducer: routerReducer,
        $enhancer: routerEnhancer,
        $middleware: routerMiddleware
    },
    fetch: {
        $middleware: $fetch
    },
    app: app,
    account: account
}, {
    predicate: (state, action) => !action.hide
});
```

## extractStore

`extractStore(redux*: Redux, jediSpec*: Object, devToolsOptions: Object)`

* `redux` All exports from redux (`import * as redux from 'redux';`)
* `jediSpec` Actions, reducers and middlewares bundled in a single object
* `devToolsOptions` [Click here for more information](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md)

# Change Log

## v2.1.0

* Added `store.reset()`

## v2.0.0

* Simplified structure
  * `stateKey` - _Topic_
    * `$state: any` - initial state object
    * `$middleware: function` - custom middleware (directly passed to redux)
    * `$reducer: function` - custom reducer (directly passed to redux; IF THIS IS SET: There should be no other $reducer methods in this particular _topic_)
    * `$enhancer: function` - custom enhancer (directly passed to redux)
    * `ACTION_TYPE: string` - type name
      * `$actions: object` - action creators (multiple)
      * `$middleware: function` - redux-like middleware
      * `$reducer: function`

# License

MIT © 2018 Alexander Löhn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
