/**
 * Firebase Connection Diagnostic Tool
 * This script checks various aspects of Firebase connectivity
 * and helps identify specific issues with the connection.
 */

// Check if browser supports all needed APIs
function checkBrowserCompatibility() {
    const results = {
        fetch: typeof fetch !== 'undefined',
        localStorage: typeof localStorage !== 'undefined',
        indexedDB: typeof indexedDB !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator,
        sessionStorage: typeof sessionStorage !== 'undefined',
        webSockets: 'WebSocket' in window
    };
    
    console.log('Browser API Compatibility:', results);
    return !Object.values(results).includes(false);
}

// Test network connectivity to Google services
async function testGoogleConnectivity() {
    try {
        const startTime = performance.now();
        const response = await fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=invalidkey', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test12345',
                returnSecureToken: true
            })
        });
        
        const endTime = performance.now();
        const pingTime = endTime - startTime;
        
        // We expect an error because we're using an invalid key,
        // but we want to ensure the API is reachable
        console.log('Google API Connectivity:', {
            reachable: true,
            status: response.status,
            pingTimeMs: pingTime.toFixed(2)
        });
        
        return true;
    } catch (error) {
        console.error('Google API Connectivity Error:', error);
        return false;
    }
}

// Check if Firebase SDK is loading properly
async function checkFirebaseSDK() {
    try {
        // Try to load Firebase App SDK
        const module = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js');
        console.log('Firebase App SDK loaded successfully');
        return true;
    } catch (error) {
        console.error('Firebase SDK Loading Error:', error);
        return false;
    }
}

// Check for firewall or content blockers
function checkForBlockers() {
    return new Promise(resolve => {
        // Create an invisible iframe to check if third-party content is being blocked
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'https://firebasestorage.googleapis.com/v0/b/firebase-heartbeat.appspot.com/o/sdk-heartbeat-check.txt?alt=media';
        
        let timeoutId = setTimeout(() => {
            document.body.removeChild(iframe);
            console.log('Content blocker detected: Firebase resources may be blocked');
            resolve(false);
        }, 3000);
        
        iframe.onload = () => {
            clearTimeout(timeoutId);
            document.body.removeChild(iframe);
            console.log('No content blockers detected for Firebase resources');
            resolve(true);
        };
        
        iframe.onerror = () => {
            clearTimeout(timeoutId);
            document.body.removeChild(iframe);
            console.log('Content blocker detected: Firebase resources may be blocked');
            resolve(false);
        };
        
        document.body.appendChild(iframe);
    });
}

// Check if API key and project are correctly configured
async function validateApiKey(apiKey) {
    try {
        // We're intentionally causing an auth error to check if the API key is valid
        // A 400 response means the key is valid but the request was malformed
        // A 401/403 means the key may be invalid
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: '',
                password: '',
                returnSecureToken: true
            })
        });
        
        const result = await response.json();
        
        if (response.status === 400) {
            console.log('API Key appears to be valid (received expected 400 error)');
            return true;
        } else {
            console.error('API Key validation failed:', result);
            return false;
        }
    } catch (error) {
        console.error('API Key validation error:', error);
        return false;
    }
}

// Check storage permissions for IndexedDB (needed by Firebase)
async function checkStoragePermissions() {
    try {
        // Try to write to IndexedDB
        const request = indexedDB.open('firebase-diagnostics-test', 1);
        return new Promise((resolve) => {
            request.onerror = () => {
                console.error('IndexedDB access denied - Firebase requires this permission');
                resolve(false);
            };
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                db.close();
                // Try to delete the test database
                const deleteRequest = indexedDB.deleteDatabase('firebase-diagnostics-test');
                deleteRequest.onsuccess = () => {
                    console.log('IndexedDB permissions OK');
                    resolve(true);
                };
                deleteRequest.onerror = () => {
                    console.log('IndexedDB permissions partial (can write but not delete)');
                    resolve(true); // Still consider this a success for Firebase
                };
            };
        });
    } catch (error) {
        console.error('Storage permissions check error:', error);
        return false;
    }
}

// Run all diagnostics and return a detailed report
async function runFirebaseDiagnostics(apiKey) {
    console.log('Running Firebase connection diagnostics...');
    
    const diagnosticResults = {
        browserCompatible: checkBrowserCompatibility(),
        googleConnectivity: await testGoogleConnectivity(),
        firebaseSDKLoaded: await checkFirebaseSDK(),
        noContentBlockers: await checkForBlockers(),
        apiKeyValid: await validateApiKey(apiKey),
        storagePermissionsGranted: await checkStoragePermissions(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        onlineStatus: navigator.onLine
    };
    
    // Calculate an overall status
    const allChecksOk = Object.values(diagnosticResults).every(val => 
        val === true || typeof val === 'string' || typeof val === 'object'
    );
    
    diagnosticResults.overallStatus = allChecksOk ? 'OK' : 'ISSUES_DETECTED';
    
    console.log('Firebase Diagnostics Complete:', diagnosticResults);
    
    // Build problem recommendations
    let recommendations = '';
    
    if (!diagnosticResults.browserCompatible) {
        recommendations += '• Your browser may not support all features needed by Firebase. Try a modern browser like Chrome, Firefox, or Edge.\n';
    }
    
    if (!diagnosticResults.googleConnectivity) {
        recommendations += '• Cannot connect to Google servers. Check firewall settings or try a different network.\n';
    }
    
    if (!diagnosticResults.firebaseSDKLoaded) {
        recommendations += '• Firebase SDK failed to load. Check for browser extensions blocking scripts or JavaScript errors.\n';
    }
    
    if (!diagnosticResults.noContentBlockers) {
        recommendations += '• Content blockers may be preventing Firebase from working. Check ad blockers, privacy extensions, or firewall settings.\n';
    }
    
    if (!diagnosticResults.apiKeyValid) {
        recommendations += '• Firebase API key appears to be invalid or restricted. The project configuration may need to be updated.\n';
    }
    
    if (!diagnosticResults.storagePermissionsGranted) {
        recommendations += '• Firebase requires IndexedDB storage permissions. Check browser privacy settings or try a private browsing session.\n';
    }
    
    diagnosticResults.recommendations = recommendations || 'All checks passed. If issues persist, try clearing browser cache or using incognito/private browsing mode.';
    
    return diagnosticResults;
}

// Export the diagnostic function
export { runFirebaseDiagnostics }; 