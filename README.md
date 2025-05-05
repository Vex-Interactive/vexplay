# Vexplay Firebase Authentication System

This repository includes a complete Firebase authentication system for Vexplay with premium content protection.

## Features

- Email/password authentication
- Google authentication
- Guest access with limited permissions
- Premium content protection for registered users
- Direct URL access protection

## Premium Content Protection

Premium games and apps are restricted based on their URLs rather than line numbers in the HTML files. The protection system prevents both direct access and access through the main game/app listings. Guest users will see a blurred version of these items and will be prompted to register when trying to access them.

### Implementing Premium Content Protection

There are three levels of protection:

1. **Directory-level protection**: Add this script to any game or app directory's index.html file:
   ```html
   <script src="/storage/js/game-protection.js"></script>
   ```
   This blocks access to the entire page if the user is a guest.

2. **URL-based protection**: The system automatically blocks URLs containing premium content paths. This provides protection against direct linking.

3. **Visual interface protection**: Premium content is blurred and overlaid with a lock icon in the main listings.

### Important: Protection Script Integration

Every premium game and app's HTML file must include the game-protection.js script to ensure proper protection. An automated script (`add-protection.js`) can be used to add this protection to all premium content pages:

```
node add-protection.js
```

This will add the protection script to the head section of each premium game/app HTML file.

## Protected Games & Apps

The following games and apps are protected and only available to registered users:

### Games
- Riddle School series
- Drift Boss
- Friday Night Funkin
- Pacman
- Papa's Pancakeria
- Rooftop Snipers
- Baldi's Basics
- Bob the Robber 2
- Minesweeper
- Pokemon Emerald
- Pokemon Fire Red
- Super Mario Bros
- Super Mario Kart
- Super Mario World
- There Is No Game
- World's Hardest Game
- Castlevania
- Donkey Kong
- Dr. Mario
- Metroid
- Super Mario Bros 2

### Apps
- WebRetro
- HTML Coder
- v86
- Calculator
- Etch a Sketch
- Zip Opener
- Godoblocks

## Authentication States

The system manages three authentication states:

1. **Not logged in**: User has not authenticated at all
2. **Guest**: User has chosen to browse as a guest (limited access, no Firebase anonymous auth required)
3. **Registered**: User has registered with email/password or Google

## Guest Mode Implementation

Guest mode now uses localStorage only without requiring Firebase anonymous authentication. This approach:
- Doesn't require enabling anonymous auth in Firebase
- Works even if Firebase has restrictions on anonymous users
- Still provides the same user experience and content restrictions
- Uses a randomly generated guest ID for each session

## Local Storage Data

The authentication status is stored in localStorage with the following keys:

- `userLoggedIn`: "true" if user is logged in (either as guest or registered)
- `isGuest`: "true" if user is a guest
- `userEmail`: Email of registered user (or "guest" for guest users)
- `userId`: Firebase user ID of registered user (or a random ID for guests)

## Firebase API Security

The Firebase API keys and configuration are protected using client-side encryption:

- All Firebase configuration values are stored encrypted in the source code
- Configuration is decrypted at runtime using a domain-specific key
- This provides protection against casual inspection and automated scrapers
- The encryption uses XOR with a domain-specific key and Base64 encoding

### Updating Firebase Configuration

When you need to update the Firebase configuration:

1. Use the provided encryption tool:
   ```
   node encrypt-config.js
   ```

2. Copy the encrypted output to replace the values in `storage/js/firebase-config.js`

3. For more details on the encryption implementation, refer to the [FIREBASE-SECURITY.md](FIREBASE-SECURITY.md) documentation.

## Implementation Notes

- The `auth.js` file contains the core authentication logic
- The `path-protection.js` file prevents direct access to premium content 
- The `premium-check.js` file provides intermediate blocking of premium content
- The `game-protection.js` file is the strongest protection for premium game pages
- All protection methods use URL-based detection instead of line numbers for more reliable protection
- The `firebase-config.js` file provides encrypted Firebase configuration 