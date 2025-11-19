'use strict';

/* Promises: Promise Chaining Overview

Promise chaining concepts distilled to essence:
- promise-chaining-essence.js - .then() chains and value flow
- (additional focused examples as needed)

Study with: Start with promise-chaining-essence.js */

// Quick demonstration of promise chaining
function getUser(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('1. User fetched');
            resolve({ id: id, name: `User${id}` });
        }, 100);
    });
}

function getPosts(user) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('2. Posts fetched');
            resolve([`${user.name}'s post 1`, `${user.name}'s post 2`]);
        }, 100);
    });
}

// Chain promises to avoid callback hell
getUser(123)
    .then(user => {
        console.log('Got user:', user.name);
        return getPosts(user); // Return promise for chaining
    })
    .then(posts => {
        console.log('Got posts:', posts.length);
        return posts[0]; // Return value (not promise)
    })
    .then(firstPost => {
        console.log('First post:', firstPost);
    })
    .catch(error => {
        console.log('Chain error:', error.message);
    });

/* See essence files for detailed chaining patterns */