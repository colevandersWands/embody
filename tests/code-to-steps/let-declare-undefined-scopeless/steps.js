export default [
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'x',
    event: 'declare'
  },
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'x',
    event: 'initialize',
    // how to differentiate between explicitly initializing to `undefined` vs. implicitly?  or is this necessary?
    value: undefined
  },
  {
    category: 'binding',
    kind: 'declarative',
    keyword: 'let',
    name: 'x',
    event: 'available'
  }
];
