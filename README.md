# redux-defmap 

[![Build State](https://travis-ci.org/loehx/redux-defmap.svg?branch=master)](https://travis-ci.org/loehx/redux-defmap) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/e852550356cc4f6aa542bc72895a19f3)](https://www.codacy.com/app/alexander.loehn/redux-defmap?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=loehx/redux-defmap&amp;utm_campaign=Badge_Grade)

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
