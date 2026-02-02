import type { BindingsRecord } from '../types.js';

function script({
  event,
  file,
  bindings,
}: {
  readonly event?: string;
  readonly file?: string;
  readonly bindings?: BindingsRecord;
} = {}) {
  return {
    category: 'scope',
    kind: 'script',
    event,
    file,
    bindings,
  };
}

export default script;
