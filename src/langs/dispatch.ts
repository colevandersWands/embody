/**
 * @file Language module dispatch registry.
 *
 * Maps language IDs to their modules. Each module provides:
 * - record: function to trace code execution
 * - events: frozen default event configuration
 */

import deepFreeze from '../utils/deep-freeze.js';

import charsEvents from './chars/events.js';
import charsRecord from './chars/record.js';

const dispatch = {
  chars: { record: charsRecord, events: deepFreeze(charsEvents) },
};

export default dispatch;
