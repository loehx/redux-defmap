import { assert } from 'chai'
import { extractActions } from '../src'

testExtractActions()

function testExtractActions() {
    describe('Extract Actions Using $actionName', () => {
        const sample = {
            TEST: {
                $actionName: 'test'
            }
        }

        it('should contain a function', () => {
            const actions = extractActions(sample, () => void(0))
            assert.typeOf(actions, 'object')
            assert.typeOf(actions.test, 'function')
        })

        it('should dispatch a single action', () => {
            let dispatched = null
            const actions = extractActions(sample, (a) => dispatched = a)

            actions.test()

            assert.typeOf(dispatched, 'object')
            assert.equal(dispatched.type, 'TEST')
            assert.ok(Object.isFrozen(dispatched))
        })

        it('should dispatch a single action with a payload', () => {
            let dispatched = null
            const actions = extractActions(sample, (a) => {
                assert.ok(a)
                dispatched = a /* ?*/
            })

            actions.test('test payload #1')
            assert.equal(dispatched.payload, 'test payload #1')

            actions.test('test payload #2', 'some extra argument')
            assert.equal(dispatched.payload, 'test payload #2')
        })
    })

    describe('Extract Actions Using Implicit Action Creators ', () => {
        const sample = {
            TYPEOF: {
                typeof: a => typeof a,
                typeofUpperCase: a => (typeof a).toUpperCase()
            }
        }

        it('should extract a single action', () => {
            const actions = extractActions(sample, () => void(0))
            assert.typeOf(actions, 'object')
            assert.typeOf(actions.typeof, 'function')
            assert.equal(Object.keys(actions).length, 2 + 1)
        })

        it('should dispatch a single action', () => {
            let dispatched = null
            const actions = extractActions(sample, (a) => dispatched = a)

            actions.typeof('TEST')

            assert.typeOf(dispatched, 'object')
            assert.equal(dispatched.type, 'TYPEOF')
            assert.equal(dispatched.payload, 'string')

            actions.typeofUpperCase(true)
            assert.equal(dispatched.type, 'TYPEOF')
            assert.equal(dispatched.payload, 'BOOLEAN')
        })

        it('should not ', () => {
            let dispatched = null
            const actions = extractActions(sample, (a) => dispatched = a)

            actions.typeof('TEST')

            assert.typeOf(dispatched, 'object')
            assert.equal(dispatched.type, 'TYPEOF')
            assert.equal(dispatched.payload, 'string')

            actions.typeofUpperCase(true)
            assert.equal(dispatched.type, 'TYPEOF')
            assert.equal(dispatched.payload, 'BOOLEAN')
        })
    })

    describe('Extract Actions Creators Without Dispatch Function', () => {
        const sample = {
            TEST: {
                inc: a => a + 1,
                dec: a => a - 1
            }
        }

        it('should return a dispatchable action', () => {
            const actions = extractActions(sample)
            assert.typeOf(actions, 'object')
            assert.typeOf(actions.inc, 'function')
            assert.typeOf(actions.dec, 'function')

            let action = actions.inc(1) /* ?*/
            assert.deepEqual(action, { type: 'TEST', payload: 2 })

            action = actions.dec(1) /* ?*/
            assert.deepEqual(action, { type: 'TEST', payload: 0 })
        })
    })
}
