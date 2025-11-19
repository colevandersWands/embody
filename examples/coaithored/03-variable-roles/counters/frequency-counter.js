'use strict';

/* Variable Roles: Frequency Counter Overview

Frequency counter concepts distilled to essence:
- frequency-counter-essence.js - tracking occurrences with counter variables
- (additional focused examples as needed)

Study with: Start with frequency-counter-essence.js */

// Multiple frequency counters for different categories
let redCount = 0;    // COUNTER: tracks red items
let blueCount = 0;   // COUNTER: tracks blue items  
let greenCount = 0;  // COUNTER: tracks green items

// Process colored items
let colors = ['red', 'blue', 'red', 'green', 'blue', 'red'];

for (let i = 0; i < colors.length; i++) {
    let color = colors[i];
    
    // Update appropriate frequency counter
    if (color === 'red') {
        redCount++;     // COUNTER: increment red frequency
    } else if (color === 'blue') {
        blueCount++;    // COUNTER: increment blue frequency
    } else if (color === 'green') {
        greenCount++;   // COUNTER: increment green frequency
    }
    
    console.log(`${color} seen (R:${redCount}, B:${blueCount}, G:${greenCount})`);
}

// Calculate percentages using counters
let total = redCount + blueCount + greenCount;
console.log(`\nFrequency analysis:`);
console.log(`Red: ${redCount}/${total} (${Math.round(redCount/total*100)}%)`);
console.log(`Blue: ${blueCount}/${total} (${Math.round(blueCount/total*100)}%)`);
console.log(`Green: ${greenCount}/${total} (${Math.round(greenCount/total*100)}%)`);

// Find dominant color
let dominant = redCount >= blueCount && redCount >= greenCount ? 'red' :
               blueCount >= greenCount ? 'blue' : 'green';
console.log(`Dominant color: ${dominant}`);

/* See essence files for detailed frequency counter exploration */