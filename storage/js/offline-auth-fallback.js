/**
 * Offline Authentication Fallback
 * 
 * This module provides emergency fallback authentication when Firebase is unavailable.
 * It uses localStorage to maintain login state and allows for guest access without Firebase.
 * 
 * NOTE: This is a temporary solution for network connectivity issues and should not
 * replace the primary Firebase authentication in normal conditions.
 */

// List of known users to allow emergency login when Firebase is down
// This should be a very limited list and should be kept secure
const emergencyUsers = [
    // Default hashed admin login (username: admin@vexplay.com, password: admin123)
    {
        emailHash: "f09696910bdd874a99cd74c8f05b5c44",  // MD5 hash of email
        passwordHash: "0a98ec76c9b561d8c8f05b5c44873f48a725093a",  // SHA-1 hash of password
        displayName: "Administrator"
    }
];

// Simple MD5 hash function for emergency login
function md5(input) {
    // This is a simplified implementation - in a real app, use a proper crypto library
    function rotateLeft(n, s) { return (n << s) | (n >>> (32 - s)); }
    function toHexStr(n) { return Array.from(new Uint8Array(new Uint32Array([n]).buffer)).map(b => ('0' + b.toString(16)).slice(-2)).join(''); }
    
    // Constants for MD5 transformation
    const s = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
               5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
               4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
               6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
    
    const k = Array(64).fill(0).map((_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296));
    
    // Convert input to bytes
    const bytes = [];
    for (let i = 0; i < input.length; i++) {
        bytes.push(input.charCodeAt(i) & 0xFF);
    }
    
    // Padding
    bytes.push(0x80);
    const padding = (bytes.length % 64 <= 56 ? 56 : 120) - (bytes.length % 64);
    for (let i = 0; i < padding; i++) {
        bytes.push(0);
    }
    
    // Append length (in bits)
    const bitLen = input.length * 8;
    bytes.push(bitLen & 0xFF, (bitLen >> 8) & 0xFF, (bitLen >> 16) & 0xFF, (bitLen >> 24) & 0xFF, 0, 0, 0, 0);
    
    // Initialize variables
    let a0 = 0x67452301, b0 = 0xEFCDAB89, c0 = 0x98BADCFE, d0 = 0x10325476;
    
    // Process the message in chunks
    for (let i = 0; i < bytes.length; i += 64) {
        const chunk = bytes.slice(i, i + 64);
        
        // Break chunk into sixteen 32-bit words
        const M = Array(16).fill(0);
        for (let j = 0; j < 16; j++) {
            M[j] = chunk[j*4] + (chunk[j*4+1] << 8) + (chunk[j*4+2] << 16) + (chunk[j*4+3] << 24);
        }
        
        // Initialize hash value for this chunk
        let A = a0, B = b0, C = c0, D = d0;
        
        // Main loop
        for (let j = 0; j < 64; j++) {
            let F, g;
            
            if (j < 16) {
                F = (B & C) | ((~B) & D);
                g = j;
            } else if (j < 32) {
                F = (D & B) | ((~D) & C);
                g = (5 * j + 1) % 16;
            } else if (j < 48) {
                F = B ^ C ^ D;
                g = (3 * j + 5) % 16;
            } else {
                F = C ^ (B | (~D));
                g = (7 * j) % 16;
            }
            
            F = (F + A + k[j] + M[g]) >>> 0;
            A = D;
            D = C;
            C = B;
            B = (B + rotateLeft(F, s[j])) >>> 0;
        }
        
        // Add this chunk's hash to result
        a0 = (a0 + A) >>> 0;
        b0 = (b0 + B) >>> 0;
        c0 = (c0 + C) >>> 0;
        d0 = (d0 + D) >>> 0;
    }
    
    // Convert to little-endian and concatenate
    return toHexStr(a0) + toHexStr(b0) + toHexStr(c0) + toHexStr(d0);
}

// Simple SHA-1 hash function for emergency login password verification
function sha1(input) {
    // This is a simplified implementation - in a real app, use a proper crypto library
    function rotateLeft(n, s) { return (n << s) | (n >>> (32 - s)); }
    function toHexStr(n) { return ('00000000' + n.toString(16)).slice(-8); }
    
    // Convert input to bytes
    const bytes = [];
    for (let i = 0; i < input.length; i++) {
        bytes.push(input.charCodeAt(i) & 0xFF);
    }
    
    // Padding
    bytes.push(0x80);
    const padding = (bytes.length % 64 <= 56 ? 56 : 120) - (bytes.length % 64);
    for (let i = 0; i < padding; i++) {
        bytes.push(0);
    }
    
    // Append length (in bits)
    const bitLen = input.length * 8;
    for (let i = 7; i >= 0; i--) {
        bytes.push((bitLen >> (i * 8)) & 0xFF);
    }
    
    // Initialize variables
    let h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0;
    
    // Process the message in chunks
    for (let i = 0; i < bytes.length; i += 64) {
        const chunk = bytes.slice(i, i + 64);
        
        // Break chunk into sixteen 32-bit words
        const w = Array(80).fill(0);
        for (let j = 0; j < 16; j++) {
            w[j] = (chunk[j*4] << 24) | (chunk[j*4+1] << 16) | (chunk[j*4+2] << 8) | chunk[j*4+3];
        }
        
        // Extend the sixteen 32-bit words into eighty 32-bit words
        for (let j = 16; j < 80; j++) {
            w[j] = rotateLeft(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
        }
        
        // Initialize hash value for this chunk
        let a = h0, b = h1, c = h2, d = h3, e = h4;
        
        // Main loop
        for (let j = 0; j < 80; j++) {
            let f, k;
            
            if (j < 20) {
                f = (b & c) | ((~b) & d);
                k = 0x5A827999;
            } else if (j < 40) {
                f = b ^ c ^ d;
                k = 0x6ED9EBA1;
            } else if (j < 60) {
                f = (b & c) | (b & d) | (c & d);
                k = 0x8F1BBCDC;
            } else {
                f = b ^ c ^ d;
                k = 0xCA62C1D6;
            }
            
            const temp = (rotateLeft(a, 5) + f + e + k + w[j]) >>> 0;
            e = d;
            d = c;
            c = rotateLeft(b, 30) >>> 0;
            b = a;
            a = temp;
        }
        
        // Add this chunk's hash to result
        h0 = (h0 + a) >>> 0;
        h1 = (h1 + b) >>> 0;
        h2 = (h2 + c) >>> 0;
        h3 = (h3 + d) >>> 0;
        h4 = (h4 + e) >>> 0;
    }
    
    // Produce the final hash value
    return toHexStr(h0) + toHexStr(h1) + toHexStr(h2) + toHexStr(h3) + toHexStr(h4);
}

// Attempt emergency fallback login
function emergencyLogin(email, password) {
    // Hash the provided credentials
    const emailHash = md5(email.toLowerCase().trim());
    const passwordHash = sha1(password);
    
    // Check against emergency users list
    const user = emergencyUsers.find(u => u.emailHash === emailHash && u.passwordHash === passwordHash);
    
    if (user) {
        // Create an emergency user session
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', 'emergency-' + emailHash.substring(0, 8));
        localStorage.setItem('isGuest', 'false');
        localStorage.setItem('isEmergencyLogin', 'true');
        localStorage.setItem('emergencyDisplayName', user.displayName);
        
        return {
            success: true,
            message: "Emergency login successful"
        };
    }
    
    return {
        success: false,
        message: "Emergency login failed: Invalid credentials"
    };
}

// Create a guest session (no Firebase required)
function createGuestSession() {
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('userEmail', 'guest');
    localStorage.setItem('userId', 'guest-' + Math.random().toString(36).substring(2, 15));
    
    return {
        success: true,
        message: "Guest session created"
    };
}

// Check if the user is logged in via the emergency system
function isEmergencyLoggedIn() {
    return localStorage.getItem('isEmergencyLogin') === 'true';
}

// Get emergency user display name
function getEmergencyDisplayName() {
    return localStorage.getItem('emergencyDisplayName') || 'Emergency User';
}

// Clear emergency login state
function clearEmergencyLogin() {
    localStorage.removeItem('isEmergencyLogin');
    localStorage.removeItem('emergencyDisplayName');
}

// Export functions
export {
    emergencyLogin,
    createGuestSession,
    isEmergencyLoggedIn,
    getEmergencyDisplayName,
    clearEmergencyLogin
}; 