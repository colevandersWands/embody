'use strict';

/* Control Flow: For Loops Overview

For loop concepts distilled to essence:
- for-loop-essence.js - basic loop structure and counter behavior
- (additional focused examples as needed)

Study with: Start with for-loop-essence.js */

// Advanced for loop patterns and techniques
function demonstrateComplexLoops() {
    console.log('=== Complex Loop Patterns ===');
    
    // Multiple variables in loop
    for (let i = 0, j = 10; i < 5; i++, j--) {
        console.log(`Forward: ${i}, Backward: ${j}`);
    }
    
    // Loop with non-standard increments
    for (let power = 1; power <= 1000; power *= 3) {
        console.log('Power of 3:', power);
    }
}

function demonstrateNestedLoops() {
    console.log('\n=== Nested Loop Patterns ===');
    
    // Creating 2D grid pattern
    let grid = [];
    for (let row = 0; row < 4; row++) {
        grid[row] = [];
        for (let col = 0; col < 4; col++) {
            grid[row][col] = (row * 4) + col + 1;
        }
    }
    
    // Display the grid
    for (let row = 0; row < grid.length; row++) {
        let line = '';
        for (let col = 0; col < grid[row].length; col++) {
            line += grid[row][col].toString().padStart(3) + ' ';
        }
        console.log(`Row ${row}: ${line}`);
    }
}

function demonstrateSearchPatterns() {
    console.log('\n=== Search and Filter Patterns ===');
    
    let numbers = [3, 7, 12, 4, 9, 15, 8];
    
    // Find first number greater than 10
    let found = null;
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] > 10) {
            found = numbers[i];
            console.log(`Found first number > 10: ${found} at index ${i}`);
            break;
        }
    }
    
    // Count numbers in range
    let count = 0;
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] >= 5 && numbers[i] <= 10) {
            count++;
            console.log(`Number in range 5-10: ${numbers[i]}`);
        }
    }
    console.log(`Total numbers in range: ${count}`);
}

function demonstrateAccumulatorPatterns() {
    console.log('\n=== Accumulator Patterns ===');
    
    // Calculate factorial
    let factorial = 1;
    let n = 5;
    for (let i = 1; i <= n; i++) {
        factorial *= i;
        console.log(`${n}! step ${i}: ${factorial}`);
    }
    
    // Build string progressively
    let result = '';
    let words = ['Hello', 'wonderful', 'world'];
    for (let i = 0; i < words.length; i++) {
        result += words[i];
        if (i < words.length - 1) {
            result += ' ';
        }
        console.log(`Building string: "${result}"`);
    }
}

function demonstrateLoopControlFlow() {
    console.log('\n=== Loop Control Flow ===');
    
    // Complex break and continue logic
    for (let i = 1; i <= 15; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            console.log(`${i}: FizzBuzz - breaking!`);
            break;
        } else if (i % 3 === 0) {
            console.log(`${i}: Fizz - continuing...`);
            continue;
        } else if (i % 5 === 0) {
            console.log(`${i}: Buzz - continuing...`);
            continue;
        }
        console.log(`${i}: Regular number`);
    }
}

demonstrateComplexLoops();
demonstrateNestedLoops();
demonstrateSearchPatterns();
demonstrateAccumulatorPatterns();
demonstrateLoopControlFlow();

/* See essence files for focused for loop exploration */