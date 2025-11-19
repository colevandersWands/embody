'use strict';

/* Closures: Private Variables Overview

Private variable concepts distilled to essence:
- private-variables-essence.js - closure-based encapsulation basics
- (additional focused examples as needed)

Study with: Start with private-variables-essence.js */

// Advanced private variable patterns
function createSecureStorage() {
    // Multiple private variables with different access levels
    let secretData = new Map();
    let accessLog = [];
    let maxEntries = 10;
    
    // Private helper functions
    function logAccess(operation, key) {
        accessLog.push({
            operation: operation,
            key: key,
            timestamp: Date.now()
        });
        
        // Keep log size manageable
        if (accessLog.length > maxEntries) {
            accessLog.shift();
        }
    }
    
    function validateKey(key) {
        return typeof key === 'string' && key.length > 0;
    }
    
    function isAuthorized(key) {
        // Simple authorization check
        return !key.startsWith('_');
    }
    
    // Public interface with different permission levels
    return {
        // Full access methods
        store: function(key, value) {
            if (validateKey(key) && isAuthorized(key)) {
                secretData.set(key, value);
                logAccess('store', key);
                console.log(`Stored data for key: ${key}`);
                return true;
            }
            console.log(`Access denied for key: ${key}`);
            return false;
        },
        
        retrieve: function(key) {
            if (validateKey(key) && isAuthorized(key)) {
                logAccess('retrieve', key);
                return secretData.get(key);
            }
            console.log(`Access denied for key: ${key}`);
            return undefined;
        },
        
        remove: function(key) {
            if (validateKey(key) && isAuthorized(key)) {
                const existed = secretData.delete(key);
                logAccess('remove', key);
                return existed;
            }
            return false;
        },
        
        // Read-only access methods
        size: function() {
            return secretData.size;
        },
        
        keys: function() {
            return Array.from(secretData.keys()).filter(key => isAuthorized(key));
        },
        
        // Administrative methods
        getAccessLog: function() {
            return [...accessLog]; // Return copy
        },
        
        clearLog: function() {
            const count = accessLog.length;
            accessLog = [];
            console.log(`Cleared ${count} log entries`);
            return count;
        },
        
        // Security audit
        audit: function() {
            console.log('=== Security Audit ===');
            console.log(`Total entries: ${secretData.size}`);
            console.log(`Log entries: ${accessLog.length}`);
            console.log(`Recent activity:`, accessLog.slice(-3));
            
            // Private data remains inaccessible
            console.log('Direct access to secretData:', this.secretData); // undefined
            console.log('Direct access to accessLog:', this.accessLog); // undefined
        }
    };
}

// User profile with private data
function createUserProfile(username) {
    // Private user data
    let userData = {
        username: username,
        email: null,
        preferences: {},
        loginHistory: []
    };
    
    let isLoggedIn = false;
    let sessionToken = null;
    
    // Private session management
    function generateToken() {
        return 'token_' + Date.now() + '_' + Math.random().toString(36);
    }
    
    function recordLogin() {
        userData.loginHistory.push({
            timestamp: Date.now(),
            token: sessionToken
        });
        
        // Keep only last 5 logins
        if (userData.loginHistory.length > 5) {
            userData.loginHistory.shift();
        }
    }
    
    // Public interface
    return {
        login: function(password) {
            // Simplified authentication
            if (password === 'secret') {
                isLoggedIn = true;
                sessionToken = generateToken();
                recordLogin();
                console.log(`${username} logged in successfully`);
                return true;
            }
            console.log('Authentication failed');
            return false;
        },
        
        logout: function() {
            if (isLoggedIn) {
                isLoggedIn = false;
                sessionToken = null;
                console.log(`${username} logged out`);
                return true;
            }
            return false;
        },
        
        setEmail: function(email) {
            if (isLoggedIn) {
                userData.email = email;
                console.log('Email updated');
                return true;
            }
            console.log('Must be logged in to update email');
            return false;
        },
        
        getPublicInfo: function() {
            return {
                username: userData.username,
                isLoggedIn: isLoggedIn,
                hasEmail: userData.email !== null
            };
        },
        
        getPrivateInfo: function() {
            if (isLoggedIn) {
                return {
                    username: userData.username,
                    email: userData.email,
                    loginCount: userData.loginHistory.length,
                    lastLogin: userData.loginHistory[userData.loginHistory.length - 1]
                };
            }
            console.log('Access denied - not logged in');
            return null;
        },
        
        // Completely private - no access to raw userData
        isAuthenticated: function() {
            return isLoggedIn && sessionToken !== null;
        }
    };
}

// Demonstrate private variable usage
console.log('=== Secure Storage Demo ===');

const storage = createSecureStorage();
storage.store('apiKey', 'abc123');
storage.store('_secret', 'hidden'); // Access denied
console.log('Retrieved:', storage.retrieve('apiKey'));
console.log('Keys:', storage.keys());
storage.audit();

console.log('\n=== User Profile Demo ===');

const user = createUserProfile('alice');
console.log('Public info:', user.getPublicInfo());
console.log('Private info (before login):', user.getPrivateInfo());

user.login('secret');
user.setEmail('alice@example.com');
console.log('Private info (after login):', user.getPrivateInfo());

// Privacy verification
console.log('\n=== Privacy Test ===');
console.log('storage.secretData:', storage.secretData); // undefined
console.log('user.userData:', user.userData); // undefined
console.log('user.sessionToken:', user.sessionToken); // undefined

/* See essence files for focused private variable exploration */