'use strict';

/* Modules: Module Factory Pattern Overview

Module factory concepts distilled to essence:
- module-factory-essence.js - creating instances with private state
- (additional focused examples as needed)

Study with: Start with module-factory-essence.js */

// Factory creates configurable module instances
function createTimer(name, interval = 1000) {
    let count = 0;
    let active = false;
    
    return {
        start() {
            if (!active) {
                active = true;
                console.log(`${name} timer started`);
            }
            return this;
        },
        
        tick() {
            if (active) {
                count++;
                console.log(`${name}: ${count}`);
            }
            return this;
        },
        
        stop() {
            active = false;
            console.log(`${name} timer stopped at ${count}`);
            return this;
        },
        
        getCount() { return count; },
        isActive() { return active; }
    };
}

// Create independent timer instances
let timer1 = createTimer('Fast', 500);
let timer2 = createTimer('Slow', 2000);

// Each has private state
timer1.start().tick().tick();
timer2.start().tick();

console.log('Timer 1 count:', timer1.getCount());
console.log('Timer 2 count:', timer2.getCount());

timer1.stop();
console.log('Timer 1 active:', timer1.isActive());
console.log('Timer 2 active:', timer2.isActive());

/* See essence files for detailed module factory exploration */