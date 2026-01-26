/**
 * Shared test values for use across multiple test files
 * Helps ensure consistent test data and avoid duplication
 */

// Custom classes for testing inheritance
export class SimpleClass {}

export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomError';
  }
}

export class DeepExtended extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'DeepExtended';
  }
}

// Edge case values
export const edgeCases = {
  // Special numbers
  numbers: {
    nan: NaN,
    infinity: Infinity,
    negInfinity: -Infinity,
    negZero: -0,
    maxValue: Number.MAX_VALUE,
    minValue: Number.MIN_VALUE,
    maxSafeInt: Number.MAX_SAFE_INTEGER,
    minSafeInt: Number.MIN_SAFE_INTEGER
  },

  // Symbols
  symbols: {
    withDesc: Symbol('test'),
    noDesc: Symbol(),
    global: Symbol.for('global')
  },

  // Functions
  functions: {
    regular: function named(a: any, b: any) { return a + b; },
    arrow: (x: any) => x,
    async async() { await Promise.resolve(); },
    *generator() { yield 1; },
    async *asyncGenerator() { yield await Promise.resolve(1); },
    anonymous() {},
    multiline: function test(
      param1: any,
      param2: any,
      param3: any
    ) {
      return param1 + param2 + param3;
    }
  },

  // Objects with special properties
  objects: {
    nullProto: Object.create(null),
    circular: (() => {
      const obj: any = { a: 1 };
      obj.self = obj;
      return obj;
    })(),
    nested: {
      level1: {
        level2: {
          level3: {
            value: 'deep'
          }
        }
      }
    }
  }
};

// Values for coercion testing
export const coercionTestValues = {
  // Falsy values
  falsy: [false, 0, -0, 0n, '', null, undefined, NaN],

  // Truthy values
  truthy: [true, 1, 'hello', [], {}, () => {}, Symbol('test'), 42n],

  // Objects with custom valueOf/toString
  customCoercion: {
    valueOfOnly: {
      valueOf() { return 42; }
    },
    toStringOnly: {
      toString() { return 'custom'; }
    },
    both: {
      valueOf() { return 100; },
      toString() { return 'ignored'; }
    }
  }
};

// Operator test cases
export const operatorTestCases = {
  // Addition operator cases
  addition: {
    stringConcat: [
      [5, 'hello'],  // number + string
      ['world', 10],  // string + number
      [true, 'test'],  // boolean + string
      [null, 'null'],  // null + string
      [[], 'array'],  // array + string
    ],
    numericAdd: [
      [5, 5],  // number + number
      [true, 1],  // boolean + number
      [false, 10],  // boolean + number
      [null, 5],  // null + number
      ['10', 20],  // string + number (when no string operand initially)
    ]
  },

  // Comparison cases
  comparison: {
    sameType: [
      ['abc', 'def'],  // string vs string
      [5, 10],  // number vs number
    ],
    mixedType: [
      ['10', 5],  // string vs number
      [true, 1],  // boolean vs number
      [null, 0],  // null vs number
    ]
  },

  // Equality cases
  equality: {
    abstract: [
      [5, '5'],  // number == string
      [true, 1],  // boolean == number
      [null, undefined],  // null == undefined special case
    ],
    strict: [
      [5, '5'],  // number === string (no coercion)
      [null, undefined],  // null === undefined (no coercion)
    ]
  }
};