/**
 * Critocracy v3.5.1 Debug Script
 * A comprehensive debugging tool for tracking game state, screens, and events
 */

// Debug configuration - enable/disable specific features
const DEBUG_CONFIG = {
    logElementChecks: true,      // Log DOM element checks
    logEventHandlers: true,      // Log event handler attachment
    logScreenTransitions: true,  // Log screen transition events
    logGameState: true,          // Log game state changes
    logFunctionCalls: true,      // Log function calls
    monitorLocalStorage: true,   // Monitor localStorage changes
    interceptEvents: true,       // Intercept and log custom events
    stackTraces: true,           // Include stack traces with errors
    breakOnErrors: false,        // Add debugger statement on errors
    logToDOM: true,              // Also display debug info on screen
    logTiming: true              // Log timing information
};

// Create debug log container if DOM logging is enabled
let debugContainer;
let gameStateSnapshot = {};
let lastScreenTransition = null;
let functionCallCounts = {};
let originalConsoleLog = console.log;
let originalConsoleError = console.error;
let originalConsoleWarn = console.warn;

document.addEventListener('DOMContentLoaded', function() {
    console.log('%c=== CRITOCRACY DEBUG SCRIPT LOADED ===', 'background: #222; color: #bada55; font-size: 16px;');
    const startTime = performance.now();
    
    // Setup debug container in DOM if enabled
    if (DEBUG_CONFIG.logToDOM) {
        setupDebugDisplay();
    }
    
    // Override console methods to add to debug display
    if (DEBUG_CONFIG.logToDOM) {
        overrideConsoleMethods();
    }
    
    // 1. Check for critical DOM elements with proper structure
    if (DEBUG_CONFIG.logElementChecks) {
        const criticalElements = [
            'start-Screen', 
            'start-Button', 
            'player-Count-Screen',
            'player-Count-Confirm-Button',
            'human-Player-Count',
            'ai-Player-Count',
            'role-Selection-Screen',
            'role-Confirm-Button',
            'turn-Order-Screen',
            'start-Game-Button',
            'game-Board-Screen',
            'end-Game-Screen'
        ];
        
        logDebug('Checking for critical DOM elements:');
        criticalElements.forEach(id => {
            const element = document.getElementById(id);
            logDebug(`${id}: ${element ? 'EXISTS' : 'MISSING'}`, element ? 'success' : 'error');
            
            // Additional checks for essential attributes
            if (element) {
                if (id.endsWith('Screen')) {
                    logDebug(`  - Display: ${element.style.display}`, 
                            element.style.display !== 'none' ? 'info' : 'warning');
                }
                if (id.endsWith('Button')) {
                    const hasClickHandler = element.onclick || getEventListeners(element).click?.length > 0;
                    logDebug(`  - Click handler: ${hasClickHandler ? 'YES' : 'NO'}`, 
                            hasClickHandler ? 'success' : 'warning');
                }
            }
        });
    }
    
    // 2. Check for game state consistency
    if (DEBUG_CONFIG.logGameState) {
        logDebug('\nChecking GameState object:');
        const gameState = window.GameState;
        if (gameState) {
            logDebug(`GameState object: EXISTS`, 'success');
            logDebug(`- playerArray: ${JSON.stringify(gameState.playerArray)}`);
            logDebug(`- humanPlayers: ${gameState.humanPlayers}`);
            logDebug(`- aiPlayers: ${gameState.aiPlayers}`);
            logDebug(`- totalPlayers: ${gameState.totalPlayers}`);
            
            // Keep a snapshot of initial game state
            gameStateSnapshot = JSON.parse(JSON.stringify(gameState));
        } else {
            logDebug(`GameState object: MISSING`, 'error');
        }
    }
    
    // 3. Intercept important event handlers to monitor transitions
    if (DEBUG_CONFIG.interceptEvents) {
        interceptEventHandlers();
    }
    
    // 4. Monitor localStorage for changes
    if (DEBUG_CONFIG.monitorLocalStorage) {
        monitorLocalStorage();
    }
    
    // 5. Add debug event listeners for screen transitions
    if (DEBUG_CONFIG.logScreenTransitions) {
        monitorScreenTransitions();
    }
    
    // 6. Monitor Role Selection issues
    monitorRoleSelectionIssues();
    
    // 7. Add global error handler with detailed reporting
    window.addEventListener('error', function(event) {
        const errorDetails = {
            message: event.message,
            source: event.filename,
            line: event.lineno,
            column: event.colno,
            error: event.error,
            stack: event.error ? event.error.stack : 'No stack trace available'
        };
        
        logDebug(`\n%cUNCAUGHT ERROR: ${errorDetails.message}`, 'color: red; font-weight: bold; font-size: 16px;', 'error');
        logDebug(`at ${errorDetails.source}:${errorDetails.line}:${errorDetails.column}`, 'error');
        
        if (DEBUG_CONFIG.stackTraces && errorDetails.stack) {
            logDebug('Stack trace:', 'error');
            logDebug(errorDetails.stack, 'error');
        }
        
        // Log game state at time of error
        if (DEBUG_CONFIG.logGameState) {
            logDebug('\nGame state at time of error:', 'error');
            logDebug(JSON.stringify(window.GameState || {}, null, 2), 'error');
        }
        
        // Log last screen transition
        if (lastScreenTransition) {
            logDebug('\nLast screen transition:', 'error');
            logDebug(JSON.stringify(lastScreenTransition, null, 2), 'error');
        }
        
        // Add breakpoint for debugging if enabled
        if (DEBUG_CONFIG.breakOnErrors) {
            debugger;
        }
        
        return false; // Let the error propagate
    });
    
    // 8. Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        logDebug(`\n%cUNHANDLED PROMISE REJECTION: ${event.reason}`, 'color: red; font-weight: bold;', 'error');
        if (DEBUG_CONFIG.stackTraces && event.reason && event.reason.stack) {
            logDebug(event.reason.stack, 'error');
        }
        return false;
    });
    
    // 9. Performance measurement
    if (DEBUG_CONFIG.logTiming) {
        const endTime = performance.now();
        logDebug(`\nDebug script initialization time: ${(endTime - startTime).toFixed(2)}ms`, 'info');
    }
    
    logDebug('\n%c=== DEBUG SETUP COMPLETE ===', 'background: #222; color: #bada55; font-size: 16px;', 'success');
});

/**
 * Log a debug message to console and optionally to DOM
 */
function logDebug(message, level = 'info', ...args) {
    // Determine how to format based on level
    let consoleMethod = originalConsoleLog;
    let color = 'white';
    
    switch(level) {
        case 'error':
            consoleMethod = originalConsoleError;
            color = 'red';
            break;
        case 'warning':
            consoleMethod = originalConsoleWarn;
            color = 'orange';
            break;
        case 'success':
            color = 'lightgreen';
            break;
        case 'info':
            color = 'lightblue';
            break;
    }
    
    // Log to console
    consoleMethod(message, ...args);
    
    // Log to DOM if enabled
    if (DEBUG_CONFIG.logToDOM && debugContainer) {
        const logContent = debugContainer.querySelector('#debug-log-content');
        if (logContent) {
            const logEntry = document.createElement('div');
            logEntry.style.color = color;
            logEntry.style.marginBottom = '2px';
            logEntry.style.borderBottom = '1px dotted rgba(255,255,255,0.2)';
            
            // Add timestamp
            const timestamp = new Date().toLocaleTimeString();
            logEntry.innerHTML = `<span style="color: gray; font-size: 10px;">[${timestamp}]</span> ${message}`;
            
            logContent.appendChild(logEntry);
            logContent.scrollTop = logContent.scrollHeight;
        }
    }
}

/**
 * Override console methods to add DOM logging
 */
function overrideConsoleMethods() {
    console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        if (args.length > 0 && typeof args[0] === 'string' && !args[0].startsWith('%c')) {
            logToDebugDOM(args[0], 'info');
        }
    };
    
    console.error = function(...args) {
        originalConsoleError.apply(console, args);
        if (args.length > 0) {
            logToDebugDOM(args[0], 'error');
        }
    };
    
    console.warn = function(...args) {
        originalConsoleWarn.apply(console, args);
        if (args.length > 0) {
            logToDebugDOM(args[0], 'warning');
        }
    };
    
    function logToDebugDOM(message, level) {
        if (debugContainer) {
            const logContent = debugContainer.querySelector('#debug-log-content');
            if (logContent) {
                const logEntry = document.createElement('div');
                logEntry.style.color = level === 'error' ? 'red' : (level === 'warning' ? 'orange' : 'white');
                logEntry.style.marginBottom = '2px';
                
                // Add timestamp
                const timestamp = new Date().toLocaleTimeString();
                logEntry.innerHTML = `<span style="color: gray; font-size: 10px;">[${timestamp}]</span> ${message}`;
                
                logContent.appendChild(logEntry);
                logContent.scrollTop = logContent.scrollHeight;
            }
        }
    }
}

/**
 * Monitor important functions by wrapping them
 */
function monitorRoleSelectionIssues() {
    // Watch for role selection issues
    try {
        // Track variables that are often undefined
        window.debugTracker = {
            selectedRole: null,
            selectedRoles: [],
            currentHumanPlayer: 0,
            humanPlayers: 0,
            roleCards: null,
            lastAction: null
        };
    } catch (e) {
        logDebug(`Error setting up role selection monitoring: ${e.message}`, 'error');
    }
}

/**
 * Intercept event handlers to monitor game flow
 */
function interceptEventHandlers() {
    // Monitor custom events
    const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function(event) {
        if (event.type === 'playersSelected') {
            logDebug(`Custom event 'playersSelected' dispatched with detail: ${JSON.stringify(event.detail)}`, 'info');
        }
        return originalDispatchEvent.call(this, event);
    };
    
    // Monitor addEventListener to track what events are being listened for
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (this.id && (type === 'click' || type.includes('player') || type.includes('role'))) {
            logDebug(`Event listener '${type}' added to element with id '${this.id}'`, 'info');
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Specifically monitor the role confirm button
    setTimeout(() => {
        const roleConfirmButton = document.getElementById('role-Confirm-Button');
        if (roleConfirmButton) {
            logDebug('Monitoring role-Confirm-Button clicks', 'info');
            const originalClick = roleConfirmButton.onclick;
            roleConfirmButton.onclick = function(event) {
                logDebug('role-Confirm-Button clicked', 'info');
                if (originalClick) {
                    return originalClick.call(this, event);
                }
            };
        } else {
            logDebug('Could not find role-Confirm-Button for monitoring', 'warning');
        }
    }, 1000);
}

/**
 * Monitor localStorage for changes
 */
function monitorLocalStorage() {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        logDebug(`localStorage.setItem('${key}', '${value}')`, 'info');
        return originalSetItem.call(this, key, value);
    };
    
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function(key) {
        const value = originalGetItem.call(this, key);
        logDebug(`localStorage.getItem('${key}') => '${value}'`, 'info');
        return value;
    };
}

/**
 * Monitor screen transitions
 */
function monitorScreenTransitions() {
    // Watch for style.display changes on screen elements
    const screens = [
        'start-Screen',
        'player-Count-Screen',
        'role-Selection-Screen',
        'turn-Order-Screen',
        'game-Board-Screen',
        'end-Game-Screen'
    ];
    
    // Use MutationObserver to detect style changes
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'style') {
                        const display = screen.style.display;
                        logDebug(`Screen transition: ${screenId} display changed to ${display}`, 'info');
                        
                        lastScreenTransition = {
                            screen: screenId,
                            display: display,
                            timestamp: new Date().toISOString()
                        };
                        
                        // Log current GameState when screen changes
                        if (window.GameState) {
                            logDebug(`GameState at ${screenId} transition:`, 'info');
                            logDebug(JSON.stringify(window.GameState), 'info');
                        }
                    }
                });
            });
            
            observer.observe(screen, { attributes: true });
            logDebug(`Now monitoring ${screenId} for display changes`, 'info');
        } else {
            logDebug(`Could not find ${screenId} to monitor transitions`, 'warning');
        }
    });
}

/**
 * Helper function to check if a function exists and log its existence
 */
function checkFunctionExists(funcName) {
    const exists = typeof window[funcName] === 'function';
    logDebug(`Function check: ${funcName} ${exists ? 'EXISTS' : 'MISSING'}`, exists ? 'success' : 'error');
    return exists;
}

/**
 * Helper function to simulate getting event listeners (not actually possible without DevTools)
 */
function getEventListeners(element) {
    // This is a stub - browser security prevents accessing actual event listeners
    // In a real debug scenario, you'd use Chrome DevTools' getEventListeners() in console
    return { click: [{ listener: 'unknown' }] };
}

// Export debugging utilities for console use
window.debugUtils = {
    logGameState: function() {
        logDebug('Current GameState:', 'info');
        logDebug(JSON.stringify(window.GameState || {}, null, 2), 'info');
    },
    compareGameState: function() {
        logDebug('GameState comparison:', 'info');
        logDebug('Initial:', 'info');
        logDebug(JSON.stringify(gameStateSnapshot, null, 2), 'info');
        logDebug('Current:', 'info');
        logDebug(JSON.stringify(window.GameState || {}, null, 2), 'info');
    },
    checkDOM: function() {
        const screens = [
            'start-Screen',
            'player-Count-Screen',
            'role-Selection-Screen',
            'turn-Order-Screen',
            'game-Board-Screen',
            'end-Game-Screen'
        ];
        
        logDebug('Current screen visibility:', 'info');
        screens.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                logDebug(`${id}: ${element.style.display || 'default'}`, 'info');
            } else {
                logDebug(`${id}: MISSING`, 'error');
            }
        });
    },
    checkRoleSelectionState: function() {
        logDebug('Role Selection Debug State:', 'info');
        logDebug(JSON.stringify(window.debugTracker || {}, null, 2), 'info');
    },
    traceFunction: function(funcName) {
        if (typeof window[funcName] === 'function') {
            const original = window[funcName];
            window[funcName] = function(...args) {
                logDebug(`TRACE: ${funcName}(${JSON.stringify(args)})`, 'info');
                const result = original.apply(this, args);
                logDebug(`TRACE: ${funcName} returned: ${JSON.stringify(result)}`, 'info');
                return result;
            };
            logDebug(`Now tracing calls to ${funcName}`, 'success');
        } else {
            logDebug(`Cannot trace ${funcName} - function not found`, 'error');
        }
    }
};
