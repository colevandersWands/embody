'use strict';

/* Variables: Block Scope TDZ

TDZ behavior within block scopes.
Shows how block boundaries create TDZ regions.

Study with:
- ?trace to see TDZ in different block types
- ?variables to track block-scoped TDZ behavior
*/

function demonstrateBlockTDZ() {
    console.log('=== Block Scope TDZ ===');
    
    // TDZ in if block
    if (true) {
        console.log('Inside if block...');
        
        // This would throw ReferenceError if uncommented:
        // console.log('blockLet before declaration: ' + blockLet);
        
        let blockLet = 'Block let value';
        const blockConst = 'Block const value';
        
        console.log('  blockLet: ' + blockLet);
        console.log('  blockConst: ' + blockConst);
    }
    
    // TDZ in for loop
    for (let i = 0; i < 2; i++) {
        console.log('Loop iteration ' + i);
        
        // Each iteration creates new TDZ
        let loopLet = 'Loop value ' + i;
        console.log('  loopLet: ' + loopLet);
    }
    
    // TDZ in arbitrary block
    {
        console.log('Inside arbitrary block...');
        
        let arbitraryLet = 'Arbitrary block value';
        console.log('  arbitraryLet: ' + arbitraryLet);
    }
    
    console.log('All block variables are now out of scope');
}

// Test block TDZ
demonstrateBlockTDZ();

/*
How do different block types create their own TDZ regions?
*/