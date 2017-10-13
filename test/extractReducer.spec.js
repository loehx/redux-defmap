import { assert } from 'chai'
import { extractReducer } from '../src'

describe('extractReducer', () => {
    test()
})

function test() {
    describe('Reducer Extraction', () => {
        const sample = {
            TEST: {
                $reduce: (state, payload) => ({
                    ...state,
                    test: payload
                })
            }
        }

        const reducer = extractReducer(sample)

        it('should extract a reducer function', () => {
            assert.typeOf(reducer, 'function')
        })

        it('should reduce the payload to the state', () => {
            const state = {}
            const newState = reducer(state, { type: 'TEST', payload: 1 })

            assert.equal(newState.test, 1)
            assert.notEqual(state, newState)
        })
    })
}
