'use strict';

/* Functions: Default Parameters - Minimal Essence

ES6 default parameters: when argument missing, use default value.
Evaluated fresh each call.

Study with: ?variables to see default vs provided values */

function greet(name = 'Guest') {
    console.log('Hello, ' + name + '!');
    return name;
}

// Default used
console.log('With default: ' + greet());

// Argument overrides default  
console.log('With argument: ' + greet('Alice'));

// Multiple defaults
function calculate(x = 5, y = x * 2) {
    console.log(x + ' + ' + y + ' = ' + (x + y));
    return x + y;
}

calculate();        // 5 + 10 = 15
calculate(3);       // 3 + 6 = 9
calculate(2, 8);    // 2 + 8 = 10

/* Why do defaults evaluate fresh each call? */