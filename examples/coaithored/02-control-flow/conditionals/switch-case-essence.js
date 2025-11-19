'use strict';

/* Control Flow: Switch-Case Statements Essence

Switch = multiple value comparison using strict equality (===).
Break prevents fall-through to next case. Default handles unmatched values.

Study with: ?trace to see case evaluation and fall-through */

let color = 'blue';

switch (color) {
    case 'red':
        console.log('Stop color');
        break;  // Exit switch
    
    case 'yellow':
        console.log('Caution color');
        break;  // Exit switch
    
    case 'green':
        console.log('Go color');
        break;  // Exit switch
    
    default:
        console.log('Unknown color');
}

// Fall-through example (no breaks)
let rating = 3;

switch (rating) {
    case 5:
        console.log('Excellent!');
    case 4:
        console.log('Very good!');  
    case 3:
        console.log('Good!');       // This executes for rating 3
    case 2:
        console.log('Fair');        // This also executes (fall-through)
    case 1:
        console.log('Poor');        // This also executes (fall-through)
}

/* Why did multiple cases execute when rating was 3? */