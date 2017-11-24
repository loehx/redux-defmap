import { assert } from 'chai'
import { extractActions, extractMiddleware, extractReducer, createStore, applyMiddleware } from '../src'

describe('extractMiddleware', () => {
    test()
})

function test() {
    describe('Middleware Extraction', () => {
        it('should extract a middleware ($before)', () => {
            const sample = {
                TEST: {
                    $before: () => void(0)
                }
            }
            const middleware = extractMiddleware(sample)
            assert.typeOf(middleware, 'function')
        })

        it('should extract a middleware ($after)', () => {
            const sample = {
                TEST: {
                    $after: () => void(0)
                }
            }
            const middleware = extractMiddleware(sample)
            assert.typeOf(middleware, 'function')
        })

        it('should extract a middleware ($middleware)', () => {
            const sample = {
                TEST: {
                    $middleware: () => void(0)
                }
            }
            const middleware = extractMiddleware(sample)
            assert.typeOf(middleware, 'function')
        })

        it('should not extract any middleware', () => {
            const sample = {
                TEST: {}
            }
            const middleware = extractMiddleware(sample)
            assert.equal(middleware, null)
        })
    })

    describe('Middleware Extraction (with store)', () => {
        let $before = () => void(0)
        let $after = () => void(0)
        let $middleware = null

        const sample = {
            TEST: {
                test: a => a,

                $before: (...args) => {
                    $before(...args)
                },

                $after: (...args) => {
                    $after(...args)
                },

                $middleware: (state, next, action) => {
                    if ($middleware) {
                        $middleware(state, next, action)
                    } else {
                        next(action)
                    }
                },

                $reduce: (state, payload) => ({
                    ...state,
                    test: payload
                })
            }
        }

        const actions = extractActions(sample)
        const middleware = extractMiddleware(sample, actions)
        const reducer = extractReducer(sample)
        const initialState = { test: 0 }
        const store = createStore(reducer, initialState, applyMiddleware(middleware), actions)

        it('should have created a middleware', () => {
            assert.typeOf(middleware, 'function')
        })

        it('should call $before', () => {
            let ran = false

            $after = () => void(0)
            $before = (context, state, payload) => {
                ran = true
                assert.equal(context, actions)
                assert.equal(state, initialState)
                assert.equal(payload, 1)
                assert.equal(state.test, 0)
            }

            actions.test(1)

            assert.ok(ran)
            assert.equal(store.getState().test, 1)
        })

        it('should call $after', () => {
            let ran = false

            $before = () => void(0)
            $after = (context, state, payload) => {
                ran = true
                assert.equal(context, actions)
                assert.notEqual(state, initialState)
                assert.equal(payload, 1)
                assert.equal(state.test, 1)
            }

            actions.test(1)

            assert.ok(ran)
        })

        it('should call $middleware', () => {
            let ran = false

            $middleware = (state, next, action) => {
                ran = true
                next({
                    type: action.type,
                    payload: action.payload + 1
                })
            }
            $after = (context, state, payload) => {
                assert.equal(context, actions)
                assert.notEqual(state, initialState)
                assert.equal(payload, 2)
                assert.equal(state.test, 2)
            }

            actions.test(1)

            assert.ok(ran)
        })
    })

    describe('Middleware Extraction (with state key)', () => {
        let $before = () => void(0)
        let $after = () => void(0)
        let $middleware = null

        const sample = {
            TEST: {
                test: a => a,

                $before: (...args) => {
                    $before(...args)
                },

                $after: (...args) => {
                    $after(...args)
                },

                $middleware: (state, next, action) => {
                    if ($middleware) {
                        $middleware(state, next, action)
                    } else {
                        next(action)
                    }
                },

                $reduce: (state, payload) => ({
                    ...state,
                    test: payload
                })
            }
        }

        const actions = extractActions(sample)
        const middleware = extractMiddleware(sample, actions, 'app')
        const reducer = extractReducer(sample)
        const initialState = { app: { test: 0 } }
        const store = createStore({
            app: reducer
        }, initialState, applyMiddleware(middleware), actions)

        it('should have created a middleware', () => {
            assert.typeOf(middleware, 'function')
        })

        it('should call $before', () => {
            let ran = false

            $after = () => void(0)
            $before = (context, state, payload) => {
                ran = true
                assert.equal(context, actions)
                assert.equal(state, initialState.app)
                assert.equal(payload, 1)
                assert.equal(state.test, 0)
            }

            actions.test(1)

            assert.ok(ran)
            assert.equal(store.getState().app.test, 1)
        })

        it('should call $after', () => {
            let ran = false

            $before = () => void(0)
            $after = (context, state, payload) => {
                ran = true
                assert.equal(context, actions)
                assert.notEqual(state, initialState)
                assert.equal(payload, 1)
                assert.equal(state.test, 1)
            }

            actions.test(1)

            assert.ok(ran)
        })

        it('should call $middleware', () => {
            let ran = false
            let beforeState = null

            $before = (context, state, payload) => {
                beforeState = state
            }

            $middleware = (state, next, action) => {
                ran = true
                assert.equal(beforeState, state)
                next({
                    type: action.type,
                    payload: action.payload + 1
                })
            }
            $after = (context, state, payload) => {
                assert.equal(context, actions)
                assert.notEqual(state, initialState)
                assert.equal(payload, 2)
                assert.equal(state.test, 2)
            }

            actions.test(1)

            assert.ok(ran)
        })
    })
}
