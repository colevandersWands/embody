'use strict';

/* Control Flow: Switch-Case Statements Overview

Switch-case concepts distilled to essence:
- switch-case-essence.js - basic switch structure and fall-through behavior
- (additional focused examples as needed)

Study with: Start with switch-case-essence.js */

// Advanced switch patterns and use cases
function demonstrateComplexSwitching() {
    console.log('=== Advanced Switch Patterns ===');
    
    // Switch with complex expressions
    let time = 14; // 2 PM in 24-hour format
    let timeOfDay = Math.floor(time / 6); // 0-3 representing quarters of day
    
    switch (timeOfDay) {
        case 0:
            console.log('Early morning (0-5)');
            console.log('Time for rest');
            break;
        case 1:
            console.log('Morning (6-11)');
            console.log('Time for breakfast and work');
            break;
        case 2:
            console.log('Afternoon (12-17)');
            console.log('Time for lunch and more work');
            break;
        case 3:
            console.log('Evening (18-23)');
            console.log('Time for dinner and relaxation');
            break;
        default:
            console.log('Invalid time calculation');
    }
}

function demonstrateMenuSystem() {
    console.log('\n=== Menu System Example ===');
    
    function processMenuChoice(choice) {
        switch (choice.toLowerCase()) {
            case 'n':
            case 'new':
                console.log('Creating new document...');
                console.log('Document created successfully');
                break;
                
            case 'o':
            case 'open':
                console.log('Opening file dialog...');
                console.log('File opened successfully');
                break;
                
            case 's':
            case 'save':
                console.log('Saving current document...');
                console.log('Document saved successfully');
                break;
                
            case 'q':
            case 'quit':
            case 'exit':
                console.log('Saving changes...');
                console.log('Goodbye!');
                break;
                
            default:
                console.log(`Unknown command: ${choice}`);
                console.log('Type "help" for available commands');
        }
    }
    
    // Test various menu choices
    ['n', 'open', 'S', 'invalid', 'quit'].forEach(choice => {
        console.log(`\nProcessing choice: "${choice}"`);
        processMenuChoice(choice);
    });
}

function demonstrateStateTransitions() {
    console.log('\n=== State Machine Example ===');
    
    function processGameState(currentState, action) {
        switch (currentState) {
            case 'menu':
                switch (action) {
                    case 'start':
                        console.log('Transitioning: menu → playing');
                        return 'playing';
                    case 'settings':
                        console.log('Transitioning: menu → settings');
                        return 'settings';
                    case 'exit':
                        console.log('Transitioning: menu → closed');
                        return 'closed';
                    default:
                        console.log('Invalid action in menu state');
                        return currentState;
                }
                
            case 'playing':
                switch (action) {
                    case 'pause':
                        console.log('Transitioning: playing → paused');
                        return 'paused';
                    case 'win':
                        console.log('Transitioning: playing → victory');
                        return 'victory';
                    case 'lose':
                        console.log('Transitioning: playing → defeat');
                        return 'defeat';
                    default:
                        console.log('Invalid action in playing state');
                        return currentState;
                }
                
            case 'paused':
                switch (action) {
                    case 'resume':
                        console.log('Transitioning: paused → playing');
                        return 'playing';
                    case 'menu':
                        console.log('Transitioning: paused → menu');
                        return 'menu';
                    default:
                        console.log('Invalid action in paused state');
                        return currentState;
                }
                
            default:
                console.log(`Unknown state: ${currentState}`);
                return 'menu'; // Safe fallback
        }
    }
    
    // Simulate state transitions
    let state = 'menu';
    let actions = ['start', 'pause', 'resume', 'win'];
    
    actions.forEach(action => {
        console.log(`Current state: ${state}, Action: ${action}`);
        state = processGameState(state, action);
        console.log(`New state: ${state}\n`);
    });
}

demonstrateComplexSwitching();
demonstrateMenuSystem();
demonstrateStateTransitions();

/* See essence files for focused switch-case exploration */