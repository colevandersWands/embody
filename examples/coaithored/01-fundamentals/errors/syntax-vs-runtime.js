/* Error Types: Syntax vs Runtime vs Logic Overview

Error type concepts distilled to essence:
- syntax-vs-runtime-essence.js - three phases of error occurrence
- (additional focused examples as needed)

Study with: Start with syntax-vs-runtime-essence.js */

// Comprehensive error examples with detailed try/catch handling
function demonstrateSyntaxErrors() {
    console.log('=== Syntax Error Examples (commented out) ===');
    // These prevent the program from running at all:
    
    // console.log('missing quote);     // SyntaxError: Unterminated string
    // let 123invalid = 'bad';          // SyntaxError: Invalid identifier  
    // function() { }                   // SyntaxError: Missing function name
    // if (true { }                     // SyntaxError: Missing closing parenthesis
}

function demonstrateRuntimeErrors() {
    console.log('=== Runtime Error Examples ===');
    
    // ReferenceError examples
    try {
        console.log(undefinedVariable);
    } catch (error) {
        console.log('ReferenceError:', error.message);
    }
    
    // TypeError examples  
    try {
        const data = null;
        console.log(data.property);
    } catch (error) {
        console.log('TypeError (null access):', error.message);
    }
    
    try {
        const notFunction = 'string';
        notFunction();
    } catch (error) {
        console.log('TypeError (not function):', error.message);
    }
}

function demonstrateLogicErrors() {
    console.log('=== Logic Error Examples ===');
    
    // Calculation logic error
    let scores = [85, 90, 78];
    
    // Wrong: multiplication instead of addition
    let wrongCalculation = scores[0] * scores[1] * scores[2];
    let wrongAverage = wrongCalculation / scores.length;
    console.log('Wrong calculation result:', wrongCalculation, 'avg:', wrongAverage);
    
    // Correct: proper addition
    let correctSum = scores[0] + scores[1] + scores[2];  
    let correctAverage = correctSum / scores.length;
    console.log('Correct calculation result:', correctSum, 'avg:', correctAverage);
    
    console.log('Note: Logic errors produce wrong results without error messages');
}

// Run all demonstrations
demonstrateSyntaxErrors();
demonstrateRuntimeErrors();
demonstrateLogicErrors();

/* See essence files for focused error type exploration */