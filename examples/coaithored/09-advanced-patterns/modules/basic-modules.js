'use strict';

/* Modules: Basic Module Pattern Overview

Basic module concepts distilled to essence:
- basic-modules-essence.js - IIFE with public/private interface separation
- (additional focused examples as needed)

Study with: Start with basic-modules-essence.js */

// Advanced module patterns and variations
const CounterModule = (function() {
    // Private state with multiple variables
    let count = 0;
    let step = 1;
    let maxValue = 100;
    let listeners = [];
    
    // Private helper functions
    function validateValue(value) {
        return typeof value === 'number' && !isNaN(value);
    }
    
    function notifyListeners(event, data) {
        listeners.forEach(listener => {
            if (typeof listener === 'function') {
                listener(event, data);
            }
        });
    }
    
    function enforceLimit(newCount) {
        if (newCount > maxValue) {
            notifyListeners('limit_reached', { count: newCount, max: maxValue });
            return maxValue;
        }
        if (newCount < 0) {
            notifyListeners('minimum_reached', { count: newCount, min: 0 });
            return 0;
        }
        return newCount;
    }
    
    // Public API
    return {
        increment: function() {
            const oldCount = count;
            count = enforceLimit(count + step);
            notifyListeners('incremented', { from: oldCount, to: count });
            return count;
        },
        
        decrement: function() {
            const oldCount = count;
            count = enforceLimit(count - step);
            notifyListeners('decremented', { from: oldCount, to: count });
            return count;
        },
        
        setStep: function(newStep) {
            if (validateValue(newStep) && newStep > 0) {
                step = newStep;
                notifyListeners('step_changed', { step: newStep });
                return true;
            }
            return false;
        },
        
        setMax: function(newMax) {
            if (validateValue(newMax) && newMax > 0) {
                maxValue = newMax;
                count = enforceLimit(count); // Recheck current value
                notifyListeners('max_changed', { max: newMax });
                return true;
            }
            return false;
        },
        
        getValue: function() {
            return count;
        },
        
        getSettings: function() {
            return {
                current: count,
                step: step,
                max: maxValue
            };
        },
        
        addListener: function(callback) {
            if (typeof callback === 'function') {
                listeners.push(callback);
                return listeners.length - 1; // Return index as handle
            }
            return -1;
        },
        
        removeListener: function(handle) {
            if (handle >= 0 && handle < listeners.length) {
                listeners.splice(handle, 1);
                return true;
            }
            return false;
        },
        
        reset: function() {
            const oldCount = count;
            count = 0;
            notifyListeners('reset', { from: oldCount, to: count });
            return count;
        }
    };
})();

// Module factory pattern
const createTimer = function(name, interval) {
    // Each timer has its own private state
    let running = false;
    let elapsed = 0;
    let intervalId = null;
    let callbacks = [];
    
    return {
        start: function() {
            if (!running) {
                running = true;
                intervalId = setInterval(() => {
                    elapsed += interval;
                    callbacks.forEach(cb => cb(elapsed));
                }, interval);
                console.log(`${name} timer started`);
            }
        },
        
        stop: function() {
            if (running) {
                running = false;
                clearInterval(intervalId);
                console.log(`${name} timer stopped at ${elapsed}ms`);
            }
        },
        
        reset: function() {
            this.stop();
            elapsed = 0;
            console.log(`${name} timer reset`);
        },
        
        getElapsed: function() {
            return elapsed;
        },
        
        onTick: function(callback) {
            callbacks.push(callback);
        },
        
        isRunning: function() {
            return running;
        }
    };
};

// Demonstrate module usage
console.log('=== Advanced Counter Module ===');

// Add event listener
const listenerHandle = CounterModule.addListener((event, data) => {
    console.log(`Event: ${event}`, data);
});

CounterModule.setStep(3);
CounterModule.setMax(20);

console.log('Initial:', CounterModule.getValue());
CounterModule.increment(); // 3
CounterModule.increment(); // 6
CounterModule.increment(); // 9

console.log('Settings:', CounterModule.getSettings());

console.log('\n=== Timer Factory ===');
const timer1 = createTimer('Fast', 100);
const timer2 = createTimer('Slow', 500);

timer1.onTick((elapsed) => {
    if (elapsed >= 300) {
        timer1.stop();
        console.log('Fast timer auto-stopped');
    }
});

timer1.start();
timer2.start();

setTimeout(() => {
    timer2.stop();
    console.log('Manual stop of slow timer');
}, 1200);

/* See essence files for focused basic module exploration */