'use strict';

/* Variables: TDZ Error Patterns

Common patterns that trigger TDZ errors.
Shows safe ways to handle potential TDZ issues.

Study with:
- ?trace to see error timing and recovery
- ?variables to track error-prone TDZ patterns
*/

function demonstrateTDZErrors() {
    console.log('=== TDZ Error Patterns ===');
    
    // Pattern 1: Self-reference during initialization
    try {
        eval('let selfRef = selfRef + " initialized"');
    } catch (error) {
        console.log('Self-reference error: ' + error.name);
    }
    
    // Pattern 2: Function call accessing TDZ variable
    function riskyFunction() {
        try {
            return riskyLet + ' accessed';
        } catch (error) {
            return 'TDZ error in function: ' + error.name;
        }
    }
    
    console.log('Before declaration: ' + riskyFunction());
    
    let riskyLet = 'Safe value';
    console.log('After declaration: ' + riskyFunction());
    
    // Pattern 3: Safe TDZ checking
    function safeTDZCheck(varName) {
        try {
            eval('typeof ' + varName);
            return 'Variable is accessible';
        } catch (error) {
            return 'Variable in TDZ: ' + error.name;
        }
    }
    
    console.log('Safe check result: ' + safeTDZCheck('futureLet'));
    let futureLet = 'Now defined';
    console.log('Safe check after: ' + safeTDZCheck('futureLet'));
}

// Test TDZ error patterns
demonstrateTDZErrors();

/*
What are common TDZ error patterns and how can they be avoided?
*/