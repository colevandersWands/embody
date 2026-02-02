import type { BindingsRecord } from '../types.js';

function functionScope({
  event,
  name,
  bindings,
}: {
  readonly event?: string;
  readonly name?: string;
  readonly bindings?: BindingsRecord;
} = {}) {
  return {
    category: 'scope',
    kind: 'function',
    event,
    name,
    bindings,
  };
}

export default functionScope;
