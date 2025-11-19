'use strict';

/* Async Foundations: Blocking vs Non-blocking Overview

Blocking vs non-blocking concepts distilled to essence:
- blocking-vs-non-blocking-essence.js - fundamental execution flow differences
- (additional focused examples as needed)

Study with: Start with blocking-vs-non-blocking-essence.js */

// Advanced patterns showing blocking vs non-blocking implications
function demonstrateUserInterface() {
    console.log('=== User Interface Implications ===');
    
    // Simulate UI operations
    function updateUI(message) {
        console.log(`UI Update: ${message}`);
    }
    
    function handleUserClick() {
        console.log('User clicked button');
    }
    
    // Blocking approach - UI freezes
    function processDataBlocking() {
        updateUI('Processing started...');
        
        // Simulate heavy processing
        const start = Date.now();
        while (Date.now() - start < 1000) {
            // CPU-intensive work that blocks everything
        }
        
        updateUI('Processing complete!');
        
        // User clicks during processing are lost/delayed
        handleUserClick(); // This would be delayed
    }
    
    // Non-blocking approach - UI remains responsive
    function processDataNonBlocking() {
        updateUI('Processing started...');
        
        // Break work into chunks
        let progress = 0;
        const totalSteps = 10;
        
        function processChunk() {
            // Do a small amount of work
            progress++;
            updateUI(`Progress: ${progress}/${totalSteps}`);
            
            if (progress < totalSteps) {
                // Schedule next chunk, allowing other code to run
                setTimeout(processChunk, 100);
            } else {
                updateUI('Processing complete!');
            }
        }
        
        processChunk();
    }
    
    console.log('Testing blocking approach:');
    processDataBlocking();
    
    setTimeout(() => {
        console.log('\nTesting non-blocking approach:');
        processDataNonBlocking();
        
        // User interactions can happen during processing
        setTimeout(() => handleUserClick(), 300);
        setTimeout(() => handleUserClick(), 600);
    }, 1500);
}

function demonstrateResourceManagement() {
    console.log('\n=== Resource Management Patterns ===');
    
    // Blocking file operations (simulated)
    function readFileBlocking(filename) {
        console.log(`Starting to read ${filename}`);
        
        // Simulate file I/O blocking
        const start = Date.now();
        while (Date.now() - start < 500) {
            // Block while reading
        }
        
        console.log(`Finished reading ${filename}`);
        return `Content of ${filename}`;
    }
    
    // Non-blocking file operations (simulated)
    function readFileNonBlocking(filename, callback) {
        console.log(`Starting to read ${filename}`);
        
        // Simulate async file I/O
        setTimeout(() => {
            console.log(`Finished reading ${filename}`);
            callback(null, `Content of ${filename}`);
        }, 500);
    }
    
    // Blocking approach - sequential
    console.log('Blocking approach (sequential):');
    const start1 = Date.now();
    
    const file1 = readFileBlocking('file1.txt');
    const file2 = readFileBlocking('file2.txt'); 
    const file3 = readFileBlocking('file3.txt');
    
    console.log(`Blocking total time: ${Date.now() - start1}ms`);
    
    // Non-blocking approach - parallel
    setTimeout(() => {
        console.log('\nNon-blocking approach (parallel):');
        const start2 = Date.now();
        let completed = 0;
        const results = {};
        
        function onComplete() {
            completed++;
            if (completed === 3) {
                console.log(`Non-blocking total time: ${Date.now() - start2}ms`);
                console.log('All files processed in parallel');
            }
        }
        
        readFileNonBlocking('file1.txt', (err, data) => {
            results.file1 = data;
            onComplete();
        });
        
        readFileNonBlocking('file2.txt', (err, data) => {
            results.file2 = data;
            onComplete();
        });
        
        readFileNonBlocking('file3.txt', (err, data) => {
            results.file3 = data;
            onComplete();
        });
        
        console.log('All file operations started immediately');
    }, 2000);
}

function demonstrateEventLoop() {
    console.log('\n=== Event Loop Behavior ===');
    
    console.log('1. Synchronous start');
    
    // Immediate execution
    console.log('2. More synchronous code');
    
    // Schedule async work
    setTimeout(() => {
        console.log('6. First timeout callback');
    }, 0);
    
    setTimeout(() => {
        console.log('7. Second timeout callback');
    }, 0);
    
    // More synchronous work
    console.log('3. Even more synchronous code');
    
    // Promise (microtask)
    Promise.resolve().then(() => {
        console.log('4. Promise microtask');
    });
    
    console.log('5. Synchronous end');
    
    // Demonstrate blocking effect
    setTimeout(() => {
        console.log('\n8. Starting blocking operation in callback');
        const start = Date.now();
        while (Date.now() - start < 200) {
            // This blocks the event loop
        }
        console.log('9. Blocking operation complete');
    }, 100);
    
    setTimeout(() => {
        console.log('10. This callback was delayed by blocking');
    }, 150);
}

// Execute demonstrations
demonstrateUserInterface();

setTimeout(() => {
    demonstrateResourceManagement();
}, 3000);

setTimeout(() => {
    demonstrateEventLoop();  
}, 6000);

/* See essence files for focused blocking vs non-blocking exploration */