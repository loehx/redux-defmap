import { assert } from 'chai'
import { extractStore } from '../src'

describe('extractStore', () => {
    test()
})

function test() {
    describe('Store Extraction (simple)', () => {
        it('should extract actions', () => {
            const store = extractStore({
                app: {
                    APP_START: {
                        test: a => ({ i: 0 })
                    }
                }
            })
            assert.typeOf(store.actions, 'object')
            assert.typeOf(store.subscribe, 'function')
            assert.typeOf(store.actions.test, 'function')
        })

        if (typeof window === 'object') {
            it('should extract actions', () => {
                let ran = false
                window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = function() {
                    return function(a) {
                        ran = true
                        return a
                    }
                }
                extractStore({
                    app: {}
                })
                assert.ok(ran)
            })
        }

        it('should create initial state', () => {
            const store = extractStore({
                app: {
                    $state: {
                        count: -1
                    },
                    APP_START: {
                        test: a => ({})
                    }
                }
            })
            assert.typeOf(store.getState(), 'object')
            assert.equal(store.getState().app.count, -1)
        })

        it('should create store with special enhancer', () => {
            let enhancerLoaded = false
            extractStore({
                app: {
                    $enhancer: (next) => {
                        return (...args) => {
                            enhancerLoaded = true
                            return next(...args)
                        }
                    }
                }
            })

            assert.ok(enhancerLoaded)
        })

        it('should throw error if state key is missing', () => {
            assert.throws(() => {
                extractStore({
                    $state: {
                        count: -1
                    },
                    TEST: {
                        func: () => null
                    }
                })
            })
        })

        it('should create sub state', () => {
            const store = extractStore({
                app: {
                    $state: {},
                    APP_START: {
                        $stateKey: 'subState',
                        test: (n) => n,
                        $before: (actions, state, payload) => {
                            state
                        },
                        $reduce: (state, n) => ({
                            ...state,
                            n
                        })
                    }
                }
            })
            store.actions.test(1)
            assert.equal(store.getState().app.n, 1)
        })

        it('should call middleware', () => {
            const store = extractStore({
                app: {
                    $state: {
                        count: -1
                    },

                    APP_START: {
                        test: a => ({ count: 0 }),

                        $before: (actions, state, payload) => {
                            payload.count++
                        },

                        $after: (actions, state, payload) => {
                            payload.count++
                        },

                        $reduce: (state, payload) => ({
                            ...state,
                            count: payload.count
                        })
                    }
                }
            })

            const action = store.actions.test()
            assert.equal(store.getState().app.count, 1) // $before modified the payload again
            assert.equal(action.payload.count, 2) // $after modified the payload again
        })

        it('should call extra reducer', () => {
            function extraReducer(state, action) {
                if (action.type === 'TEST') {
                    return {
                        ...state,
                        count: action.payload.count
                    }
                }
                return state || {}
            }

            const store = extractStore({
                app: {
                    TEST: {
                        test: a => ({ count: 0 }),

                        $reduce: (state, payload) => ({
                            ...state,
                            count: payload.count
                        })
                    }
                },
                extra: {
                    $reducer: extraReducer
                }
            })

            store.actions.test()

            assert.equal(store.getState().app.count, 0)
            assert.equal(store.getState().extra.count, 0)
        })

        it('should call extra middleware', () => {
            function middleware(store) {
                return next => action => {
                    action.payload.count += 1
                    next(action)
                }
            }

            const store = extractStore({
                app: {
                    TEST: {
                        test: a => ({ count: 0 }),

                        $reduce: (state, payload) => ({
                            ...state,
                            count: payload.count
                        })
                    }
                },
                extra: {
                    $middleware: middleware
                }
            })

            store.actions.test()
            assert.equal(store.getState().app.count, 1)
        })

        it('should apply extra middlewares', () => {
            let count = 0
            const store = extractStore({
                app: {
                    APP_START: {
                        test: a => ({ i: 0 })
                    }
                },
                middleware1: {
                    $middleware: store => next => action => {
                        count++
                        next(action)
                    }
                },
                middleware2: {
                    $middleware: store => next => action => {
                        count++
                        next(action)
                    }
                }
            })

            store.actions.test()
            assert.equal(2, count)
        })
    })
}
