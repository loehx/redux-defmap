import { assert } from 'chai'
import * as redux from 'redux'
import { extractStore } from '../src'

describe('extractStore', () => {
    test()
})

function test() {
    describe('Store Extraction (simple)', () => {
        it('should extract actions', () => {
            const store = extractStore(redux, {
                app: {
                    APP_START: {
                        $actions: {
                            test: a => ({ i: 0 })
                        }
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
                extractStore(redux, {
                    app: {}
                })
                assert.ok(ran)
            })
        }

        it('should create initial state', () => {
            const store = extractStore(redux, {
                app: {
                    $state: {
                        count: -1
                    },
                    APP_START: {
                        $actions: {
                            test: a => ({})
                        }
                    }
                }
            })
            assert.typeOf(store.getState(), 'object')
            assert.equal(store.getState().app.count, -1)
        })

        it('should create store with special enhancer', () => {
            let enhancerLoaded = false
            extractStore(redux, {
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
                extractStore(redux, {
                    $state: {
                        count: -1
                    },
                    TEST: {
                        $actions: {
                            func: () => null
                        }
                    }
                })
            })
        })

        it('should call middleware', () => {
            const store = extractStore(redux, {
                app: {
                    $state: {
                        count: -1
                    },

                    APP_START: {
                        $actions: {
                            test: a => ({ count: 0 })
                        },

                        $middleware: (store, next, action) => {
                            assert.ok(store.actions.test)
                            action.payload.count += 1
                            next(action)
                        },

                        $reducer: (state, payload) => ({
                            ...state,
                            count: payload.count
                        })
                    }
                }
            })

            store.actions.test()
            assert.equal(store.getState().app.count, 1)
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

            const store = extractStore(redux, {
                app: {
                    TEST: {
                        $actions: {
                            test: a => ({ count: 0 })
                        },
                        $reducer: (state, payload) => ({
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

            const store = extractStore(redux, {
                app: {
                    TEST: {
                        $actions: {
                            test: a => ({ count: 0 })
                        },
                        $reducer: (state, payload) => ({
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
            const store = extractStore(redux, {
                app: {
                    APP_START: {
                        $actions: {
                            test: a => ({ i: 0 })
                        }
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

        it('should reset the state', () => {
            const store = extractStore(redux, {
                app: {
                    $state: 0,
                    INCREMENT: {
                        $actions: {
                            increment: () => null
                        },
                        $reducer: (count) => count + 1
                    }
                }
            })

            assert.equal(store.getState().app, 0)
            store.actions.increment()
            assert.equal(store.getState().app, 1)
            store.reset()
            assert.equal(store.getState().app, 0)
        })
    })
}
