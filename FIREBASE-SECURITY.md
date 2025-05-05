# Firebase Security Implementation

This document describes how Firebase API keys and configuration are secured in the Vexplay project.

## Overview

To protect Firebase API keys and configuration from being exposed in client-side code, we've implemented a simple encryption system that:

1. Encrypts all Firebase configuration values
2. Stores only encrypted values in the source code
3. Decrypts configuration at runtime when needed
4. Uses domain-specific encryption to make it harder to extract keys

## How It Works

### Encryption Method

We use a simple but effective XOR encryption combined with Base64 encoding:

1. The encryption key is derived from the domain name and a static key
2. Each character in the configuration is XOR'd with the corresponding character in the encryption key
3. The result is Base64 encoded for safe storage in JavaScript files

### Files Involved

- `storage/js/firebase-config.js`: Contains the encrypted configuration and methods to decrypt it
- `storage/js/encrypt-firebase-config.js`: Developer utility to encrypt new configurations (not used in production)
- `login.html` and `signup.html`: Using the encrypted configuration instead of hardcoded values

## For Developers

### Updating Firebase Configuration

If you need to update the Firebase configuration (e.g., changing API keys or project settings):

1. Run the `encrypt-firebase-config.js` script after updating the configuration values in it:
   ```
   node storage/js/encrypt-firebase-config.js
   ```
   or open it in a browser console.

2. Copy the encrypted configuration output and replace the `encryptedConfig` object in `firebase-config.js`

3. **IMPORTANT**: Delete the real API keys from `encrypt-firebase-config.js` after use

### Security Considerations

- This method provides protection against casual inspection of source code
- It helps prevent automated scrapers from extracting API keys
- It is not completely secure against determined attackers who can reverse engineer the JavaScript
- For maximum security, implement proper backend authentication and proxy requests to Firebase

## Best Practices

1. Never commit actual API keys to version control
2. Regularly rotate Firebase API keys
3. Set up proper Firebase Security Rules to restrict access even if API keys are compromised
4. Use Firebase App Check for additional security
5. Implement IP whitelisting where possible
6. Monitor Firebase usage for unusual patterns

## Troubleshooting

If you encounter issues with Firebase authentication after updating the configuration:

1. Check the browser console for decryption errors
2. Verify that the encryption key generation is working correctly (domain-based)
3. Ensure all configuration values were properly encrypted

## Additional Resources

- [Firebase Security Best Practices](https://firebase.google.com/docs/web/learn-more#web-api-keys)
- [Securing API Keys in Frontend Applications](https://firebase.google.com/docs/projects/api-keys) 