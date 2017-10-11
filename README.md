# redux-defmap

Bring structure to redux applications

## Why?

* Actions and reducers in one file
* Action consts are defined only once
* Prevent configuration problems
* Payload validation
* Split complex code into structued fragments
* Logging

## Installation

```
npm install --save redux-defmap
```

## extractActions

`actions/app.js`

```js
import { isString } from 'lodash';

export default {
    FETCH_SIDEBAR_CONTENT: {
        fetchSidebarContent: (lang, name) => ({
            lang,
            name,
            url: `./${lang}/contents/${name}`
        }),
        $validation: {
            lang: isString,
            name: isString
        },
        $reduce: (state, payload) => ({
            ...state,
            sidebarContent: replaceAssetUrls(payload.data)
        })
    },
}
```

`actions/index.js`

```js
import { extractActions } from 'redux-defmap';

import app from './app';

export default extractActions({
    ...app,
    // add new action collections here
}); // necessary if the store imports this file
```

`some_file.js`
```js
import actions from './actions';

actions.fetchSidebarContent('en', 'some_content'); // returns { type: 'FETCH_SIDEBAR_CONTENT', payload: { ... } }
```
