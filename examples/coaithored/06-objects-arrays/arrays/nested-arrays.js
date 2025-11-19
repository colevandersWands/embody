'use strict';

/* Arrays: Nested Arrays

Demonstrates arrays containing other arrays.
Shows 2D array access and manipulation.

Study with:
- ?variables to see nested structure
- ?trace to follow multi-dimensional access
*/

// 2D array (matrix)
let matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

console.log('Matrix:', matrix);

// Accessing nested elements
console.log('\nAccessing elements:');
console.log('Row 0:', matrix[0]);
console.log('Row 1, Col 2:', matrix[1][2]); // 6
console.log('Center element:', matrix[1][1]); // 5

// Modifying nested elements
matrix[0][0] = 99;
console.log('\nAfter modifying [0][0]:', matrix);

// Iterating through 2D array
console.log('\nIterating through matrix:');
for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
        console.log(`  [${row}][${col}] = ${matrix[row][col]}`);
    }
}

// Array of objects
let students = [
    { name: 'Alice', grades: [85, 92, 78] },
    { name: 'Bob', grades: [90, 87, 95] }
];

console.log('\nStudent grades:');
students.forEach(student => {
    console.log(`${student.name}: ${student.grades.join(', ')}`);
});

/*
Educational questions:
- How do you access elements in multi-dimensional arrays?
- What's the difference between matrix[1] and matrix[1][1]?
- How can you iterate through nested arrays efficiently?
*/