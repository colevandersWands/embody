/**
 * @file Default events configuration for the chars language module.
 *
 * These defaults are frozen at the dispatch layer.
 * The API layer merges user config on top of these.
 */

import type { CharsEvents } from './types.js';

const events: CharsEvents = {
  remove: [],
  replace: {},
  direction: 'lr',
};

export default events;
