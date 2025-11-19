'use strict';

/* Modules: Revealing Module Pattern Overview

Revealing module pattern concepts distilled to essence:
- revealing-module-essence.js - private definition then selective revelation
- (additional focused examples as needed)

Study with: Start with revealing-module-essence.js */

let TaskManager = (function() {
    // Private state
    let tasks = [];
    let nextId = 1;
    
    // Private helpers
    function generateId() { return nextId++; }
    function isValid(task) { return task && task.title; }
    
    // Public functions defined privately
    function addTask(title) {
        if (!isValid({ title })) return null;
        
        let task = { id: generateId(), title, done: false };
        tasks.push(task);
        console.log('Added:', title);
        return task;
    }
    
    function completeTask(id) {
        let task = tasks.find(t => t.id === id);
        if (task) {
            task.done = true;
            console.log('Completed:', task.title);
        }
        return task;
    }
    
    function getTasks() { return [...tasks]; }
    function getCount() { return tasks.length; }
    
    // Reveal selected functions
    return {
        add: addTask,
        complete: completeTask,
        list: getTasks,
        count: getCount
        // generateId, isValid stay private
    };
})();

// Use revealed interface
TaskManager.add('Learn JavaScript');
TaskManager.add('Write tests');
TaskManager.complete(1);

console.log('Tasks:', TaskManager.list());
console.log('Count:', TaskManager.count());

/* See essence files for detailed revealing module exploration */