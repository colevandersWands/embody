'use strict';

/* Variable Roles: Feature Toggle Flags

Feature flags enable/disable functionality.
FLAG role: controls which features are active.

Study with:
- ?variables to see feature flags controlling functionality
- ?trace to follow feature activation logic
*/

// Feature toggle flags
console.log('=== Feature toggle flags ===');
let enableNewFeature = true;     // FLAG role: controls new feature
let enableBetaFeature = false;   // FLAG role: controls beta feature

// Display features based on flags
console.log('Available features:');
console.log('- Basic stats (always on)');
console.log('- User profile (always on)');

if (enableNewFeature) {
    console.log('- New analytics panel (enabled)');
} else {
    console.log('- New analytics panel (disabled)');
}

if (enableBetaFeature) {
    console.log('- Beta recommendations (enabled)');
} else {
    console.log('- Beta recommendations (disabled)');
}

// Toggle features and show again
console.log('\nToggling beta feature...');
enableBetaFeature = true;

console.log('Updated features:');
console.log('- Basic stats');

if (enableNewFeature) {
    console.log('- New analytics panel');
}

if (enableBetaFeature) {
    console.log('- Beta recommendations (now enabled!)');
}

/*
How do feature flags control which functionality is available?
*/