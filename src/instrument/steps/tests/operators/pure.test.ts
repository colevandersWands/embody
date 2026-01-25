import createPureOperationEvent from '../../operators/pure.js';

describe('pure operator factory with new value signature', () => {
  describe('event structure', () => {
    it('creates event with correct category and kind', () => {
      const event = createPureOperationEvent(
        {
        operator: '+',
        operands: [5, 5],
        result: 10
      },
        { data: 'full', coercion: true }
      );

      expect(event.category).toBe('operator');
      expect(event.kind).toBe('pure');
      expect(event.operator).toBe('+');
    },
        { data: 'full', coercion: true }
      );

    it('all values have consistent four-field structure', () => {
      const event = createPureOperationEvent(
        {
        operator: '+',
        operands: [5, 'hello'],
        result: '5hello'
      },
        { data: 'full', coercion: true }
      );

      // Check operands have four fields
      event.operands.forEach(op => {
        expect(op).toHaveProperty('type');
        expect(op).toHaveProperty('value');
        expect(op).toHaveProperty('lookup');
        expect(op).toHaveProperty('instance');
      },
        { data: 'full', coercion: true }
      );

      // Check result has four fields
      expect(event.result).toHaveProperty('type');
      expect(event.result).toHaveProperty('value');
      expect(event.result).toHaveProperty('lookup');
      expect(event.result).toHaveProperty('instance');
    },
        { data: 'full', coercion: true }
      );
  },
        { data: 'full', coercion: true }
      );

  describe('value representation', () => {
    it('primitive operands have null instance', () => {
      const event = createPureOperationEvent(
        {
        operator: '+',
        operands: [5, 'hello'],
        result: '5hello'
      },
        { data: 'full', coercion: true }
      );

      expect(event.operands[0]).toEqual({
        type: 'number',
        value: 5,
        lookup: ['Number', 'Object', 'null'],
        instance: null
      },
        { data: 'full', coercion: true }
      );

      expect(event.operands[1]).toEqual({
        type: 'string',
        value: 'hello',
        lookup: ['String', 'Object', 'null'],
        instance: null
      },
        { data: 'full', coercion: true }
      );

      expect(event.result).toEqual({
        type: 'string',
        value: '5hello',
        lookup: ['String', 'Object', 'null'],
        instance: null
      },
        { data: 'full', coercion: true }
      );
    },
        { data: 'full', coercion: true }
      );

    it('object operands have proper instance', () => {
      const event = createPureOperationEvent(
        {
        operator: '+',
        operands: [[], []],
        result: ''
      },
        { data: 'full', coercion: true }
      );

      expect(event.operands[0].type).toBe('object');
      expect(event.operands[0].instance).toBe('Array');
      expect(event.operands[0].lookup).toEqual(['Array', 'Object', 'null']);

      expect(event.operands[1].type).toBe('object');
      expect(event.operands[1].instance).toBe('Array');
    },
        { data: 'full', coercion: true }
      );

    it('handles special values correctly', () => {
      const event = createPureOperationEvent(
        {
        operator: '==',
        operands: [null, undefined],
        result: true
      },
        { data: 'full', coercion: true }
      );

      expect(event.operands[0]).toEqual({
        type: 'object',
        value: null,
        lookup: [],
        instance: null
      },
        { data: 'full', coercion: true }
      );

      expect(event.operands[1]).toEqual({
        type: 'undefined',
        value: undefined,
        lookup: [],
        instance: null
      },
        { data: 'full', coercion: true }
      );

      expect(event.result).toEqual({
        type: 'boolean',
        value: true,
        lookup: ['Boolean', 'Object', 'null'],
        instance: null
      },
        { data: 'full', coercion: true }
      );
    },
        { data: 'full', coercion: true }
      );
  },
        { data: 'full', coercion: true }
      );

  describe('coercion field', () => {
    it('includes coercion field with all operands', () => {
      const event = createPureOperationEvent(
        {
          operator: '+',
          operands: [5, 'hello'],
          result: '5hello'
        },
        { data: 'full', coercion: true }
      );

      expect(event.coercion).toBeDefined();
      expect(event.coercion[0]).toEqual({
        type: 'string',
        value: '5',
        lookup: ['String', 'Object', 'null'],
        instance: null
      });
      expect(event.coercion[1]).toEqual({
        type: 'string',
        value: 'hello',
        lookup: ['String', 'Object', 'null'],
        instance: null
      });
    });

    it('includes coercion field even when values unchanged', () => {
      const event = createPureOperationEvent(
        {
          operator: '+',
          operands: [5, 5],
          result: 10
        },
        { data: 'full', coercion: true }
      );

      // Coercion field is always present, showing both operands after coercion
      expect(event.coercion).toBeDefined();
      expect(event.coercion[0]).toEqual({
        type: 'number',
        value: 5,
        lookup: ['Number', 'Object', 'null'],
        instance: null
      });
      expect(event.coercion[1]).toEqual({
        type: 'number',
        value: 5,
        lookup: ['Number', 'Object', 'null'],
        instance: null
      });
    });

    it('handles abstract equality coercion', () => {
      const event = createPureOperationEvent(
        {
          operator: '==',
          operands: [5, '5'],
          result: true
        },
        { data: 'full', coercion: true }
      );

      expect(event.coercion).toBeDefined();
      expect(event.coercion[0]).toEqual({
        type: 'number',
        value: 5,
        lookup: ['Number', 'Object', 'null'],
        instance: null
      });
      expect(event.coercion[1]).toEqual({
        // String coerced to number
        type: 'number',
        value: 5,
        lookup: ['Number', 'Object', 'null'],
        instance: null
      });
    });

    it('handles strict equality (returns both as-is)', () => {
      const event = createPureOperationEvent(
        {
          operator: '===',
          operands: [5, '5'],
          result: false
        },
        { data: 'full', coercion: true }
      );

      // Coercion array is present but values are unchanged
      expect(event.coercion).toBeDefined();
      expect(event.coercion[0]).toEqual({
        type: 'number',
        value: 5,
        lookup: ['Number', 'Object', 'null'],
        instance: null
      });
      expect(event.coercion[1]).toEqual({
        type: 'string',
        value: '5',
        lookup: ['String', 'Object', 'null'],
        instance: null
      });
    });
  },
        { data: 'full', coercion: true }
      );

  describe('various operators', () => {
    it('unary operator', () => {
      const event = createPureOperationEvent(
        {
          operator: 'typeof',
          operands: ['hello'],
          result: 'string'
        },
        { data: 'full', coercion: true }
      );

      expect(event.operator).toBe('typeof');
      expect(event.operands.length).toBe(1);
      expect(event.result.value).toBe('string');
      // Coercion array includes the operand as-is
      expect(event.coercion).toBeDefined();
      expect(event.coercion[0]).toEqual({
        type: 'string',
        value: 'hello',
        lookup: ['String', 'Object', 'null'],
        instance: null
      });
    });

    it('binary arithmetic operator', () => {
      const event = createPureOperationEvent(
        {
        operator: '-',
        operands: ['10', 5],
        result: 5
      },
        { data: 'full', coercion: true }
      );

      expect(event.operator).toBe('-');
      expect(event.coercion).toBeDefined();
      expect(event.coercion[0]).toEqual({
        type: 'number',
        value: 10,
        lookup: ['Number', 'Object', 'null'],
        instance: null
      },
        { data: 'full', coercion: true }
      );
    },
        { data: 'full', coercion: true }
      );

    it('comparison operator', () => {
      const event = createPureOperationEvent(
        {
        operator: '<',
        operands: ['10', 5],
        result: false
      },
        { data: 'full', coercion: true }
      );

      expect(event.operator).toBe('<');
      expect(event.result.value).toBe(false);
      expect(event.coercion).toBeDefined();
    },
        { data: 'full', coercion: true }
      );

    it('in operator', () => {
      const event = createPureOperationEvent(
        {
        operator: 'in',
        operands: [0, ['a', 'b']],
        result: true
      },
        { data: 'full', coercion: true }
      );

      expect(event.operator).toBe('in');
      expect(event.coercion[0]).toEqual({
        type: 'string',
        value: '0',
        lookup: ['String', 'Object', 'null'],
        instance: null
      });
      expect(event.coercion[1]).toEqual({
        type: 'object',
        value: ['a', 'b'],
        lookup: ['Array', 'Object', 'null'],
        instance: 'Array'
      });
    });

    it('instanceof operator', () => {
      const event = createPureOperationEvent(
        {
          operator: 'instanceof',
          operands: [[], Array],
          result: true
        },
        { data: 'full', coercion: true }
      );

      expect(event.operator).toBe('instanceof');
      expect(event.result.value).toBe(true);
      // Coercion array is present with both operands as-is
      expect(event.coercion).toBeDefined();
      expect(event.coercion.length).toBe(2);
    });
  },
        { data: 'full', coercion: true }
      );

  describe('edge cases', () => {
    it('empty operands array', () => {
      const event = createPureOperationEvent(
        {
          operator: 'weird',
          operands: [],
          result: 'something'
        },
        { data: 'full', coercion: true }
      );

      expect(event.operands).toEqual([]);
      // Coercion array is empty too
      expect(event.coercion).toEqual([]);
    });

    it('handles NaN result', () => {
      const event = createPureOperationEvent(
        {
        operator: '-',
        operands: ['not a number', 5],
        result: NaN
      },
        { data: 'full', coercion: true }
      );

      expect(event.result.type).toBe('number');
      expect(Number.isNaN(event.result.value)).toBe(true);
    },
        { data: 'full', coercion: true }
      );

    it('handles Infinity', () => {
      const event = createPureOperationEvent(
        {
        operator: '/',
        operands: [1, 0],
        result: Infinity
      },
        { data: 'full', coercion: true }
      );

      expect(event.result).toEqual({
        type: 'number',
        value: Infinity,
        lookup: ['Number', 'Object', 'null'],
        instance: null
      },
        { data: 'full', coercion: true }
      );
    },
        { data: 'full', coercion: true }
      );

    it('handles functions as operands', () => {
      const fn = function test() {};
      const event = createPureOperationEvent(
        {
        operator: '+',
        operands: [fn, ''],
        result: 'function test() {}'
      },
        { data: 'full', coercion: true }
      );

      expect(event.operands[0].type).toBe('function');
      expect(event.operands[0].instance).toBe('Function');
      expect(event.operands[0].value.name).toBe('test');
      expect(event.operands[0].value.preview).toBe('function test() { }');
    },
        { data: 'full', coercion: true }
      );
  },
        { data: 'full', coercion: true }
      );
},
        { data: 'full', coercion: true }
      );
