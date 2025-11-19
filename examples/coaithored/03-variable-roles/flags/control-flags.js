'use strict';

/* Variable Roles: Control Flags Overview

Control flag concepts have been split into focused examples:
- processing-control-flags.js - start/stop processing control
- feature-toggle-flags.js - enable/disable functionality
- monitoring-control-flags.js - control logging and monitoring

Study with:
- Start with processing-control-flags.js for core concepts
- ?variables to see FLAG role controlling execution
*/

// Quick demonstration of control concept
console.log('=== Control Flag Core Concept ===');

let isEnabled = false;      // FLAG role: controls feature behavior

console.log('Feature status: ' + (isEnabled ? 'enabled' : 'disabled'));

if (isEnabled) {
    console.log('Feature is running...');
} else {
    console.log('Feature is disabled');
}

// Toggle the flag
isEnabled = true;
console.log('After toggle: ' + (isEnabled ? 'enabled' : 'disabled'));

if (isEnabled) {
    console.log('Feature is now running!');
}

/*
See the focused examples for detailed exploration of control flags.
*/