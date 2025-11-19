'use strict';

/* Error Types: Syntax vs Runtime vs Logic Essence

Three error types = three different timing phases of program execution.
Understanding when errors occur helps predict and prevent them.

Study with: ?trace to see execution phases and error timing */

// 1. SYNTAX ERRORS - prevent program from starting
// Uncomment to see:
// let 123invalid = 'bad';    // SyntaxError: Invalid identifier

// 2. RUNTIME ERRORS - thrown during execution  
try {
    let data = null;
    console.log(data.property);  // TypeError: null access
} catch (error) {
    console.log('Caught:', error.name);
}

// 3. LOGIC ERRORS - wrong results, no error message
let score1 = 85, score2 = 90, score3 = 78;

// Wrong: using * instead of +
let wrongSum = score1 * score2 * score3;  // 595,350 (way too big!)
console.log('Wrong sum:', wrongSum);

// Correct: proper addition
let correctSum = score1 + score2 + score3;  // 253 (reasonable)
console.log('Correct sum:', correctSum);

/* Why does logic error produce wrong results instead of error messages? */