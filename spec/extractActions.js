(function () {
  'use strict';

  const assert = require('assert');
  const { extractActions } = require('../src');

  const defMap = {
    TEST_ACTION: {
      $actionName: 'testAction'
    }
  };

  describe('Action Definition Map', function () {
    describe('Extract actions from a definition map', function () {
      it('should extract a single action with no further logic', function () {
        const actions = extractActions(defMap);

        assert.ok(action);
      });
    });
  });
})();
