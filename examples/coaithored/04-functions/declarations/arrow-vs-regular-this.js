'use strict';

/* Functions: Arrow vs Regular - This Binding

Arrow's killer feature: lexical this (inherits from surrounding).
Regular functions: dynamic this (depends on call).

Study with: ?variables to see this binding differences */

let obj = {
    name: 'Object',
    
    regular: function() {
        console.log('Regular this.name: ' + this.name);
        return this.name;
    },
    
    arrow: () => {
        console.log('Arrow this: ' + this);  // undefined in strict mode
        return this;
    },
    
    demo: function() {
        let innerRegular = function() {
            return 'Inner regular this: ' + this;
        };
        let innerArrow = () => {
            return 'Inner arrow this.name: ' + this.name;  // Lexical!
        };
        
        console.log(innerRegular());
        console.log(innerArrow());
    }
};

obj.regular();  // Works - this is obj
obj.arrow();    // Doesn't work - this is outer scope
obj.demo();     // Arrow preserves this from demo method

/* When do you need lexical this? */