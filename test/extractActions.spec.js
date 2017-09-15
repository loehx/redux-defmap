import { expect } from 'chai'
import {extractActions} from '../src'

testExtractActions()

function testExtractActions () {
  describe('Extract Actions From Definition Map', () => {

    const sample = {
      TEST: {
        $actionName: 'test'
      }
    }

    it('should extract a single action', () => {
      const actions = extractActions(sample, () => void(0));
      expect(actions).to.be.an('object');
      expect(actions.test).to.be.a('function');
    })

    it('should dispatch a single action', () => {
      let dispatched = null;
      const actions = extractActions(sample, (a) => dispatched = a);

      actions.test();
      
      expect(dispatched).to.be.an('object');
      expect(dispatched.type).to.equal('TEST');
    })

    it('should dispatch a single action with a payload', () => {
      let dispatched = null;
      const actions = extractActions(sample, (a) => dispatched = a);

      actions.test('test payload');
      expect(dispatched.payload).to.equal('test payload');

      actions.test('test payload', 'some extra argument');
      expect(dispatched.payload).to.equal('test payload');
    })
  })
}
