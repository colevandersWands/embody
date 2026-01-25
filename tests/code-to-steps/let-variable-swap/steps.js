export default [
  // let a = 2;
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'a',
    event: 'declare'
  },
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'a',
    event: 'initialize',
    value: 2
  },
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'a',
    event: 'available'
  },

  // let b = 1;
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'b',
    event: 'declare'
  },
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'b',
    event: 'initialize',
    value: 1
  },
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'b',
    event: 'available'
  },

  // let temp;
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'temp',
    event: 'declare'
  },
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'temp',
    event: 'initialize',
    value: undefined,
    implicit: true
  },
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'temp',
    event: 'available'
  },

  // temp = a;
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'a',
    event: 'read',
    value: 2
  },
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'temp',
    event: 'assign',
    value: 2
  },

  // a = b;
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'b',
    event: 'read',
    value: 1
  },
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'a',
    event: 'assign',
    value: 1
  },

  // b = temp;
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'temp',
    event: 'read',
    value: 2
  },
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'b',
    event: 'assign',
    value: 2
  }
];
