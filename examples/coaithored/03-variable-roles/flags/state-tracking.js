'use strict';

/* Variable Roles: State Tracking Flags

Demonstrates flags used to track current state and transitions.
Shows how state flags help manage complex program states.

Study with:
- ?variables to see state transitions
- ?trace to follow state-dependent behavior
*/

// Simple state machine with three states
let isRed = true;
let isYellow = false; 
let isGreen = false;

console.log('Initial: ' + (isRed ? 'RED' : 'GREEN'));

// State transition: Red -> Green
isRed = false;
isGreen = true;
console.log('Changed to: ' + (isGreen ? 'GREEN' : 'RED'));

// Game state with multiple flags
let isGameActive = false;
let isGamePaused = false;
let score = 0;

// Try to score when game inactive (should fail)
if (isGameActive && !isGamePaused) {
    score += 10;
} else {
    console.log('Cannot score - game not ready');
}

// Start game and score successfully  
isGameActive = true;
if (isGameActive && !isGamePaused) {
    score += 10;
    console.log('Score: ' + score);
}

/*
How do state flags help manage complex transitions and prevent invalid operations?
*/