'use strict';

/* Callback Patterns: Callback Hell Overview

Callback hell concepts distilled to essence:
- callback-hell-essence.js - pyramid of doom from nested callbacks
- (additional focused examples as needed)

Study with: Start with callback-hell-essence.js */

// Async operations that depend on each other
function fetchUser(id, callback) {
    setTimeout(() => {
        console.log('1. User fetched');
        callback({ id, posts: ['post1', 'post2'] });
    }, 100);
}

function fetchComments(post, callback) {
    setTimeout(() => {
        console.log('2. Comments fetched');
        callback([`comment1 on ${post}`, `comment2 on ${post}`]);
    }, 100);
}

function fetchReplies(comment, callback) {
    setTimeout(() => {
        console.log('3. Replies fetched');
        callback([`reply to ${comment}`]);
    }, 100);
}

// The callback hell - notice the pyramid shape
fetchUser(123, function(user) {
    console.log('Got user with', user.posts.length, 'posts');
    
    fetchComments(user.posts[0], function(comments) {
        console.log('Got', comments.length, 'comments');
        
        fetchReplies(comments[0], function(replies) {
            console.log('Got', replies.length, 'replies');
            console.log('Final:', replies[0]);
            // Imagine 10 levels deep!
        });
    });
});

console.log('Code continues...');

/*
Problems:
- Pyramid of doom (> shaped nesting)
- Hard to read and maintain
- Difficult error handling
- Adding steps means more nesting
*/

/* See essence files for detailed callback hell exploration */