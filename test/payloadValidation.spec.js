import { assert } from 'chai'
import { extractReducer } from '../src'

testPayloadValidation()

function testPayloadValidation() {
    describe('Payload Validation (simple)', () => {
        const sample = {
            TEST: {
                test: a => a,
                $validation: a => typeof a === 'string',
                $reduce: (state, payload) => payload
            }
        }

        it('should succeed', () => {
            const reducer = extractReducer(sample)
            const state = reducer({}, { type: 'TEST', payload: 'test' })

            assert.equal(state, 'test')
        })

        it('should fail (because payload is a number nad should be a string)', () => {
            const reducer = extractReducer(sample)
            assert.throws(() => reducer({}, { type: 'TEST', payload: 1 }))
        })

        it('should fail (because payload is missing)', () => {
            const reducer = extractReducer(sample)
            assert.throws(() => reducer({}, { type: 'TEST' }))
        })
    })

    describe('Payload Validation (complex)', () => {
        const sample = {
            TEST: {
                test: a => a,
                $validation: {
                    argString: a => typeof a === 'string',
                    argNumber: a => typeof a === 'number',
                    argNull: a => a === null,
                    argMissing: a => a === undefined
                },
                $reduce: (state, payload) => payload
            }
        }

        it('should succeed', () => {
            const reducer = extractReducer(sample)
            const payload = {
                argString: 'test',
                argNumber: 1,
                argNull: null
            }
            reducer({}, { type: 'TEST', payload })
        })

        it('should fail (argMissing is present)', () => {
            const reducer = extractReducer(sample)
            const payload = {
                argString: 'test',
                argNumber: 1,
                argNull: null,
                argMissing: 1
            }

            assert.throws(() => reducer({}, { type: 'TEST', payload }))
        })

        it('should fail (argNull is undefined)', () => {
            const reducer = extractReducer(sample)
            const payload = {
                argString: 'test',
                argNumber: 1,
                argNull: undefined
            }

            assert.throws(() => reducer({}, { type: 'TEST', payload }))
        })

        it('should fail (because payload is missing)', () => {
            const reducer = extractReducer(sample)
            assert.throws(() => reducer({}, { type: 'TEST' }))
        })
    })
}
