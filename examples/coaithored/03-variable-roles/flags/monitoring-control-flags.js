'use strict';

/* Variable Roles: Monitoring Control Flags

Control flags enable/disable monitoring and logging.
FLAG role: controls data collection and reporting.

Study with:
- ?variables to see monitoring flags affecting output
- ?trace to follow conditional monitoring logic
*/

// Monitoring control flags
console.log('=== Monitoring control flags ===');
let enablePerformanceMonitoring = false;   // FLAG role: controls performance tracking
let enableDetailedLogging = true;          // FLAG role: controls log verbosity

// Simulate some operations with monitoring
for (let operation = 1; operation <= 3; operation++) {
    console.log('Executing operation ' + operation);
    
    if (enableDetailedLogging) {
        console.log('  Log: Starting operation ' + operation);
    }
    
    // Simulate work
    let result = operation * 10;
    
    if (enablePerformanceMonitoring) {
        console.log('  Performance: Operation took 5ms');
    }
    
    if (enableDetailedLogging) {
        console.log('  Log: Operation ' + operation + ' completed with result ' + result);
    }
}

// Enable performance monitoring
console.log('\nEnabling performance monitoring...');
enablePerformanceMonitoring = true;

console.log('Operation with monitoring enabled:');
let finalOperation = 4;
console.log('Executing operation ' + finalOperation);

if (enableDetailedLogging) {
    console.log('  Log: Starting operation ' + finalOperation);
}

if (enablePerformanceMonitoring) {
    console.log('  Performance: Operation took 3ms');
}

/*
How do monitoring flags control data collection and reporting?
*/