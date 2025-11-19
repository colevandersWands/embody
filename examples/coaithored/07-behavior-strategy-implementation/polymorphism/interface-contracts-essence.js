'use strict';

/* Polymorphism: Interface Contracts Essence

Interface contract = objects with same methods can be used interchangeably.
Duck typing: if it has the right methods, it can be used as that type.

Study with: ?trace to see interface validation */

// Check if object meets "movable" interface
function isMovable(obj) {
    return obj && typeof obj.move === 'function';
}

// Different objects implementing same interface
let car = {
    speed: 60,
    move: function() {
        console.log(`Car drives at ${this.speed} mph`);
    }
};

let bird = {
    altitude: 100,
    move: function() {
        console.log(`Bird flies at ${this.altitude} feet`);
    }
};

// Use any movable object
function startMoving(vehicle) {
    if (isMovable(vehicle)) {
        vehicle.move(); // Works for any object with move()
    } else {
        console.log('Cannot move - no move method!');
    }
}

startMoving(car);   // Car drives at 60 mph
startMoving(bird);  // Bird flies at 100 feet
startMoving({});    // Cannot move - no move method!

/* How does duck typing enable polymorphism in JavaScript? */