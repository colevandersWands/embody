'use strict';

/* Polymorphism: Method Dispatch

Demonstrates how JavaScript decides which method to call.
Shows dynamic method resolution at runtime.

Study with:
- ?trace to see method lookup
- ?variables to see object method binding
*/

// Base shape behavior
let shapes = [
    {
        type: 'circle',
        radius: 5,
        area: function() {
            return Math.PI * this.radius * this.radius;
        },
        describe: function() {
            return `Circle with radius ${this.radius}`;
        }
    },
    {
        type: 'rectangle',
        width: 4,
        height: 6,
        area: function() {
            return this.width * this.height;
        },
        describe: function() {
            return `Rectangle ${this.width}x${this.height}`;
        }
    },
    {
        type: 'triangle',
        base: 8,
        height: 3,
        area: function() {
            return 0.5 * this.base * this.height;
        },
        describe: function() {
            return `Triangle base=${this.base} height=${this.height}`;
        }
    }
];

// Same method name, different implementations
console.log('Shape areas:');
shapes.forEach(shape => {
    console.log(`${shape.describe()}: ${shape.area().toFixed(2)}`);
});

// Method dispatch based on object type
function calculateTotal(shapeArray) {
    let total = 0;
    shapeArray.forEach(shape => {
        // JavaScript dispatches to the correct area() method
        total += shape.area();
    });
    return total;
}

console.log('\nTotal area:', calculateTotal(shapes).toFixed(2));

/*
Educational questions:
- How does JavaScript know which area() method to call?
- What happens if an object doesn't have the expected method?
- How is this different from static method dispatch?
*/