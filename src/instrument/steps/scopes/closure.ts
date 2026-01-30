import type { BindingsRecord } from '../types.js';

function closure({
  event,
  bindings,
  parentName,
  parentCall, // ID reference to the enclosing function call entry
}: {
  readonly event?: string;
  readonly bindings?: BindingsRecord;
  readonly parentName?: string;
  readonly parentCall?: number;
} = {}) {
  return {
    category: 'scope',
    kind: 'function',
    event,
    bindings,
    parentName,
    parentCall,
  };
}

export default closure;
