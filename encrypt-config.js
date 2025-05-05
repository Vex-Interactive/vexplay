#!/usr/bin/env node

/**
 * Firebase Configuration Encryption Tool
 * 
 * This script encrypts Firebase configuration for use in the Vexplay application.
 * Run this script when you need to update Firebase credentials or configuration.
 * 
 * Usage:
 *   node encrypt-config.js
 * 
 * After running, copy the encrypted configuration to storage/js/firebase-config.js
 */

// Simple encryption function using XOR with a key
function encrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return Buffer.from(result).toString('base64'); // Base64 encode for safe storage
}

// Get encryption key (same algorithm as used in the browser)
function getEncryptionKey() {
    const domain = "vexplay.com"; // Use production domain
    const staticKey = "Vexplay_Secure_Key_2024";
    return domain + staticKey;
}

// Function to encrypt a Firebase configuration
function encryptFirebaseConfig(config) {
    const key = getEncryptionKey();
    
    return {
        apiKey: encrypt(config.apiKey, key),
        authDomain: encrypt(config.authDomain, key),
        projectId: encrypt(config.projectId, key),
        storageBucket: encrypt(config.storageBucket, key),
        messagingSenderId: encrypt(config.messagingSenderId, key),
        appId: encrypt(config.appId, key),
        measurementId: encrypt(config.measurementId, key)
    };
}

// Read configuration from command line arguments or use default
let config = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBrD_IAs4WIf4ikI-9jdwgH65gXErj8Dv8",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "vexplay-33e9f.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "vexplay-33e9f",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "vexplay-33e9f.firebaseStorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "797854431681",
    appId: process.env.FIREBASE_APP_ID || "1:797854431681:web:b09b88437937b9fc551740",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-KRWYW4Z4Y3"
};

// Encrypt the configuration
const encryptedConfig = encryptFirebaseConfig(config);

// Output the encrypted configuration in a format ready to paste
console.log("\n=== ENCRYPTED FIREBASE CONFIGURATION ===\n");
console.log("const encryptedConfig = {");
console.log(`    apiKey: "${encryptedConfig.apiKey}",`);
console.log(`    authDomain: "${encryptedConfig.authDomain}",`);
console.log(`    projectId: "${encryptedConfig.projectId}",`);
console.log(`    storageBucket: "${encryptedConfig.storageBucket}",`);
console.log(`    messagingSenderId: "${encryptedConfig.messagingSenderId}",`);
console.log(`    appId: "${encryptedConfig.appId}",`);
console.log(`    measurementId: "${encryptedConfig.measurementId}"`);
console.log("};");

console.log("\n=== INSTRUCTIONS ===\n");
console.log("1. Copy the encrypted configuration above");
console.log("2. Replace the 'encryptedConfig' object in 'storage/js/firebase-config.js'");
console.log("3. IMPORTANT: Do NOT commit this script with real API keys to version control");
console.log("4. For CI/CD pipelines, use environment variables to provide the Firebase configuration");

// Provide example of how to use environment variables
console.log("\n=== EXAMPLE USING ENVIRONMENT VARIABLES ===\n");
console.log("FIREBASE_API_KEY=your_api_key \\");
console.log("FIREBASE_AUTH_DOMAIN=your_app.firebaseapp.com \\");
console.log("FIREBASE_PROJECT_ID=your_project_id \\");
console.log("FIREBASE_STORAGE_BUCKET=your_app.firebaseStorage.app \\");
console.log("FIREBASE_MESSAGING_SENDER_ID=your_sender_id \\");
console.log("FIREBASE_APP_ID=your_app_id \\");
console.log("FIREBASE_MEASUREMENT_ID=your_measurement_id \\");
console.log("node encrypt-config.js"); 