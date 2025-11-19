'use strict';

/* Async Foundations: Callback Timing Overview

Callback timing concepts distilled to essence:
- callback-timing-essence.js - event loop and callback scheduling basics
- (additional focused examples as needed)

Study with: Start with callback-timing-essence.js */

// Advanced callback timing patterns
function demonstrateMicrotasks() {
    console.log('=== Microtask vs Macrotask Timing ===');
    
    console.log('1. Synchronous start');
    
    // Macrotask (setTimeout)
    setTimeout(() => {
        console.log('6. Macrotask: setTimeout');
    }, 0);
    
    // Microtask (Promise)
    Promise.resolve().then(() => {
        console.log('3. Microtask: Promise 1');
    });
    
    Promise.resolve().then(() => {
        console.log('4. Microtask: Promise 2');
    });
    
    // Another macrotask
    setTimeout(() => {
        console.log('7. Macrotask: setTimeout 2');
        
        // Microtask inside macrotask
        Promise.resolve().then(() => {
            console.log('8. Microtask inside macrotask');
        });
    }, 0);
    
    // More microtasks
    Promise.resolve().then(() => {
        console.log('5. Microtask: Promise 3');
    });
    
    console.log('2. Synchronous end');
}

function demonstrateCallbackRacing() {
    console.log('\n=== Callback Racing ===');
    
    const results = [];
    const startTime = Date.now();
    
    function recordResult(name, delay) {
        return function() {
            const elapsed = Date.now() - startTime;
            results.push({ name, delay, elapsed });
            console.log(`${elapsed}ms: ${name} (scheduled for ${delay}ms)`);
            
            if (results.length === 4) {
                analyzeResults();
            }
        };
    }
    
    function analyzeResults() {
        console.log('\n=== Timing Analysis ===');
        results.sort((a, b) => a.elapsed - b.elapsed);
        results.forEach(r => {
            const diff = r.elapsed - r.delay;
            console.log(`${r.name}: Expected ${r.delay}ms, Actual ${r.elapsed}ms (diff: ${diff}ms)`);
        });
    }
    
    // Schedule callbacks with different delays
    setTimeout(recordResult('Fast', 10), 10);
    setTimeout(recordResult('Medium', 50), 50);
    setTimeout(recordResult('Slow', 100), 100);
    setTimeout(recordResult('Immediate', 0), 0);
}

function demonstrateBlockingEffects() {
    console.log('\n=== Blocking Effects on Callbacks ===');
    
    const startTime = Date.now();
    
    function logTiming(message) {
        console.log(`${Date.now() - startTime}ms: ${message}`);
    }
    
    logTiming('Scheduling callbacks');
    
    // Schedule callback
    setTimeout(() => {
        logTiming('First callback executed');
    }, 100);
    
    // Block for 200ms
    logTiming('Starting blocking operation');
    const blockUntil = Date.now() + 200;
    while (Date.now() < blockUntil) {
        // Blocking the event loop
    }
    logTiming('Blocking operation complete');
    
    // This will execute after the blocked callback
    setTimeout(() => {
        logTiming('Second callback executed');
    }, 0);
}

function demonstrateCallbackQueue() {
    console.log('\n=== Callback Queue Order ===');
    
    let order = 1;
    
    function createCallback(name) {
        return function() {
            console.log(`${order++}. ${name}`);
        };
    }
    
    // Multiple callbacks with same delay
    for (let i = 1; i <= 3; i++) {
        setTimeout(createCallback(`Timer ${i}`), 0);
    }
    
    // Mix different timing mechanisms
    if (typeof setImmediate !== 'undefined') {
        setImmediate(createCallback('Immediate'));
    }
    
    if (typeof process !== 'undefined' && process.nextTick) {
        process.nextTick(createCallback('NextTick'));
    }
    
    // Promises (microtasks)
    Promise.resolve().then(createCallback('Promise 1'));
    Promise.resolve().then(createCallback('Promise 2'));
    
    console.log('0. Synchronous code complete');
}

// Execute demonstrations
demonstrateMicrotasks();

setTimeout(() => {
    demonstrateCallbackRacing();
}, 200);

setTimeout(() => {
    demonstrateBlockingEffects();
}, 500);

setTimeout(() => {
    demonstrateCallbackQueue();
}, 1000);

/* See essence files for focused callback timing exploration */