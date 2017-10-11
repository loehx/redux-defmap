import { assert } from 'chai'
import { extractActions, extractMiddleware, extractReducer, createStore, applyMiddleware } from '../src'

testExtractActions()

function testExtractActions() {
    describe('Middleware Extraction', () => {
        let $before = () => void(0)
        let $after = () => void(0)

        const sample = {
            TEST: {
                test: a => a,

                $before: (...args) => {
                    console.log(args)
                    $before(...args)
                },

                $after: (...args) => {
                    $after(...args)
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
    })
}
