// open in new tab setting
document.addEventListener('DOMContentLoaded', () => {
    function cookie(name, value = null, days = null) {
        if (value !== null) {
            let expires = "";
            if (days) {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        } else {
            let cookieArr = document.cookie.split(';');
            for (let i = 0; i < cookieArr.length; i++) {
                let cookiePair = cookieArr[i].split('=');
                if (name === cookiePair[0].trim()) {
                    return decodeURIComponent(cookiePair[1]);
                }
            }
            return null;
        }
    }

    let openBlankCookie = cookie('open-blank');
    if (openBlankCookie === null) {
        openBlankCookie = 'true';
        cookie('open-blank', openBlankCookie, 365);
    }

    if (openBlankCookie === 'false') {
        let anchorTags = document.querySelectorAll('a[target="_blank"]');
        
        anchorTags.forEach(anchor => {
            anchor.removeAttribute('target');
        });
    }
});

// search bar
function filterGames() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const buttons = document.querySelectorAll('.button h2');

    buttons.forEach(button => {
        const gameName = button.textContent.toLowerCase();
        const buttonContainer = button.parentElement.parentElement;

        if (gameName.includes(searchInput)) {
            buttonContainer.style.display = 'block'; 
        } else {
            buttonContainer.style.display = 'none';
        }
    });
}

document.getElementById('search').addEventListener('input', filterGames);

// Add keyboard shortcut for search (press '/' to focus search)
document.addEventListener('keydown', function(e) {
    // Don't trigger if already in an input field
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && 
        document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault(); // Prevent typing '/' in any input field
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// genre filtering
const genreDropdown = document.getElementById('genreDropdown');

genreDropdown.addEventListener('change', () => {
    const selectedGenre = genreDropdown.value;
    const buttons = document.querySelectorAll('.button');
    
    buttons.forEach(button => {
        const dataGenre = button.getAttribute('data-genre');
        
        if (selectedGenre === 'all' || selectedGenre === dataGenre) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
});

genreDropdown.value = 'all';

// cool typing
const text = "games";
const typingDelay = 500; 
const initialDelay = 100; 
const cursor = document.getElementById("cursor");
const h1 = document.querySelector(".typewriter");

function type() {
setTimeout(() => {
    for (let i = 0; i < text.length; i++) {
    setTimeout(() => {
        h1.textContent += text[i];
        if (i === text.length - 1) {
        cursor.style.display = "none"; 
        }
    }, i * typingDelay);
    }
}, initialDelay);
}

type();

// open in blank tab
document.addEventListener('DOMContentLoaded', function() {
    var openBlankLink = document.getElementById('openBlankLink');

    openBlankLink.addEventListener('click', function(event) {
        event.preventDefault();

        var newTab = window.open('about:blank', '_blank');

        if (newTab) {
            var newTabBody = newTab.document.body;
            newTabBody.style.padding = '0';
            newTabBody.style.margin = '0';
            newTabBody.style.border = 'hidden';

            var iframe = document.createElement('iframe');
            iframe.src = window.location.href;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'hidden';

            iframe.onload = function() {
                var links = iframe.contentDocument.querySelectorAll('a[target="_blank"]');
                links.forEach(function(link) {
                    link.addEventListener('click', function(event) {
                        event.preventDefault();
                        iframe.contentWindow.location.href = link.href;
                    });
                });
            };

            newTab.document.body.appendChild(iframe);
        } else {
            alert("couldn't manage to open a new tab :(");
        }
    });
}); 

// favouritng games
document.addEventListener("DOMContentLoaded", function () {
    const pinButtons = document.querySelectorAll(".pin-button");
    const pinnedContainer = document.querySelector(".pinned-container");
    const pinnedHeader = document.querySelector(".pinned-header");
    const allGamesHeader = document.querySelector(".allgames-header")

    // Check if user is logged in (non-guest)
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const isGuest = localStorage.getItem('isGuest') === 'true';
    const userId = localStorage.getItem('userId');
    const canFavorite = isLoggedIn && !isGuest && userId;
    
    // Get pinned games from localStorage initially (will be replaced with Firestore data for logged-in users)
    let pinnedGames = JSON.parse(localStorage.getItem("pinnedGames")) || [];
    
    // Firebase reference
    let db = null;
    
    // Initialize Firebase if it's available and user is logged in
    if (canFavorite) {
        try {
            // Check if Firebase is loaded
            if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
                db = firebase.firestore();
                console.log("Firebase initialized for game favorites");
                
                // Load pinned games from Firestore for logged-in users
                loadFavoritesFromFirestore();
            } else {
                console.warn("Firebase not available for favorites, falling back to localStorage");
                // Wait a bit and try again if Firebase might be loading
                setTimeout(() => {
                    if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
                        db = firebase.firestore();
                        console.log("Firebase initialized for game favorites (delayed)");
                        loadFavoritesFromFirestore();
                    }
                }, 2000);
            }
        } catch (error) {
            console.error("Error initializing Firebase for favorites:", error);
        }
    }
    
    // Function to load favorites from Firestore
    async function loadFavoritesFromFirestore() {
        if (!db || !userId) return;
        
        try {
            const doc = await db.collection('userProfiles').doc(userId).get();
            if (doc.exists && doc.data().pinnedGames) {
                pinnedGames = doc.data().pinnedGames;
                localStorage.setItem("pinnedGames", JSON.stringify(pinnedGames));
                console.log("Loaded pinned games from Firestore:", pinnedGames);
                updatePinnedUI();
            }
        } catch (error) {
            console.error("Error loading favorites from Firestore:", error);
        }
    }
    
    // Function to save favorites to Firestore
    async function saveFavoritesToFirestore() {
        if (!db || !userId) return;
        
        try {
            await db.collection('userProfiles').doc(userId).update({
                pinnedGames: pinnedGames,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Saved pinned games to Firestore");
        } catch (error) {
            console.error("Error saving favorites to Firestore:", error);
            
            // If update fails (document might not exist), try set with merge
            try {
                await db.collection('userProfiles').doc(userId).set({
                    pinnedGames: pinnedGames,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                console.log("Created pinnedGames in Firestore profile");
            } catch (setError) {
                console.error("Error creating pinnedGames in Firestore:", setError);
            }
        }
    }

    function updatePinnedUI() {
        if (pinnedGames.length === 0) {
            pinnedContainer.style.display = "none";
            pinnedHeader.style.display = "none";
            allGamesHeader.style.display = "none";
        } else {
            pinnedContainer.style.display = "block";
            pinnedHeader.style.display = "block";
            allGamesHeader.style.display = "block"

            pinnedContainer.innerHTML = "";
            pinnedGames.forEach((game) => {
                const gameLink = document.createElement("a");
                gameLink.href = game.link;
                gameLink.target = "_blank";

                const gameButton = document.createElement("div");
                gameButton.classList.add("button");
                gameButton.style.backgroundImage = `url('${game.thumbnail}')`;
                gameButton.innerHTML = `<h2>${game.name}</h2>`;

                const pinButton = document.createElement("span");
                pinButton.classList.add("pin-button");

                const img = document.createElement("img");
                img.src = "/images/other/cross.png";
                img.width = 25;
                img.height = 25;

                pinButton.appendChild(img);

                pinButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    unpinGame(game.name);
                });

                gameButton.appendChild(pinButton);
                gameLink.appendChild(gameButton);
                pinnedContainer.appendChild(gameLink);
            });
        }
    }

    function pinGame(name, thumbnail, link) {
        // Check if user can favorite games
        if (!canFavorite) {
            // Show login prompt
            showLoginToFavoritePrompt();
            return;
        }
        
        const isAlreadyPinned = pinnedGames.some((game) => game.name === name);
        if (!isAlreadyPinned) {
            pinnedGames.push({ name, thumbnail, link });
            localStorage.setItem("pinnedGames", JSON.stringify(pinnedGames));
            
            // If Firebase is available, save to Firestore
            if (db) {
                saveFavoritesToFirestore();
            }
            
            updatePinnedUI();
        }
    }

    function unpinGame(name) {
        // Check if user can favorite games
        if (!canFavorite) {
            // Show login prompt
            showLoginToFavoritePrompt();
            return;
        }
        
        const index = pinnedGames.findIndex((game) => game.name === name);
        if (index !== -1) {
            pinnedGames.splice(index, 1);
            localStorage.setItem("pinnedGames", JSON.stringify(pinnedGames));
            
            // If Firebase is available, save to Firestore
            if (db) {
                saveFavoritesToFirestore();
            }
            
            updatePinnedUI();
        }
    }
    
    function showLoginToFavoritePrompt() {
        // Check if we already have a prompt
        if (document.getElementById('login-favorite-prompt')) {
            return;
        }
        
        // Create a prompt div
        const promptDiv = document.createElement('div');
        promptDiv.id = 'login-favorite-prompt';
        promptDiv.style.position = 'fixed';
        promptDiv.style.top = '50%';
        promptDiv.style.left = '50%';
        promptDiv.style.transform = 'translate(-50%, -50%)';
        promptDiv.style.backgroundColor = 'var(--background-color)';
        promptDiv.style.padding = '20px';
        promptDiv.style.borderRadius = '10px';
        promptDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        promptDiv.style.zIndex = '1000';
        promptDiv.style.maxWidth = '400px';
        promptDiv.style.textAlign = 'center';
        promptDiv.style.border = '3px solid var(--border-color2)';
        
        promptDiv.innerHTML = `
            <h3>Login Required</h3>
            <p>You need to be logged in to favorite games.</p>
            <p>Favorited games will be available on all your devices.</p>
            <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                <button id="cancel-favorite" style="padding: 8px 16px; background-color: var(--background-color); color: var(--text-color); border: 2px solid var(--border-color2); border-radius: 5px; cursor: pointer;">Cancel</button>
                <button id="login-to-favorite" style="padding: 8px 16px; background-color: var(--background-color); color: var(--text-color); border: 2px solid var(--border-color2); border-radius: 5px; cursor: pointer;">Login</button>
            </div>
        `;
        
        document.body.appendChild(promptDiv);
        
        // Event listeners for buttons
        document.getElementById('cancel-favorite').addEventListener('click', () => {
            promptDiv.remove();
        });
        
        document.getElementById('login-to-favorite').addEventListener('click', () => {
            window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.href);
        });
    }

    pinButtons.forEach((pinButton, index) => {
        pinButton.addEventListener("click", (event) => {
            event.preventDefault();
            const gameDiv = pinButton.closest(".button");
            const thumbnail = gameDiv.style.backgroundImage
                .replace('url("', '')
                .replace('")', '');
            const name = gameDiv.querySelector("h2").textContent;
            const link = gameDiv.parentElement.href; 
            pinGame(name, thumbnail, link);
        });
    });
    updatePinnedUI();
});

// downloading handler

const OFFLINE_MODE = [
    // offline mode page files
    '/offline.html',
    '/images/backgrounds/VexPlay/offlinebg.jpg',
    '/images/ico.ico',
    '/storage/fonts/ubuntu/Ubuntu.woff2',
    '/storage/js/directories.json',

    // download ruffle
    '/storage/ruffle/a29c1b01570ffecf6fae.wasm',
    '/storage/ruffle/core.ruffle.1caf8a7231ccf85abb1d.js',
    '/storage/ruffle/core.ruffle.1caf8a7231ccf85abb1d.js.map',
    '/storage/ruffle/core.ruffle.78cc902cbabd4bc44008.js',
    '/storage/ruffle/core.ruffle.78cc902cbabd4bc44008.js.map',
    '/storage/ruffle/d6c752be1c7e690bf226.wasm',
    '/storage/ruffle/package.json',
    '/storage/ruffle/ruffle.js',
    '/storage/ruffle/ruffle.js.map',

    // download cloaking
    '/storage/js/cloak.js',
    '/images/icons/google.ico',
    '/images/icons/bing.ico',
    '/images/icons/gmail.ico',
    '/images/icons/desmos.ico',
    '/images/icons/googleclassroom.ico',
    '/images/icons/wikipedia.ico',
    '/images/icons/chromenewtab.ico',
    '/images/icons/googledrive.ico'
];

async function areEssentialFilesCached() {
    const cache = await caches.open('offlinemode-cache');
    const promises = OFFLINE_MODE.map(async (file) => {
        const response = await cache.match(file);
        return !!response;
    });
    const results = await Promise.all(promises);
    return results.every(result => result);
}

async function cacheEssentialFiles() {
    const cache = await caches.open('game-cache');
    await cache.addAll(OFFLINE_MODE);
}

async function ensureEssentialFiles(promptDiv) {
    const essentialFilesCached = await areEssentialFilesCached();
    if (!essentialFilesCached) {
        promptDiv.querySelector('p').textContent = `downloading offline mode files. speed of this may depend on your internet connection. `;
        await cacheEssentialFiles();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.download-button').forEach(button => {
        button.addEventListener('click', handleDownloadClick);
    });
});

function handleDownloadClick(event) {
    event.preventDefault(); 
    const gameButton = event.target.closest('.button');
    const gameName = gameButton.querySelector('h2').textContent;
    const gameDirectory = gameButton.closest('a').getAttribute('href');
    showConfirmationPrompt(gameName, gameDirectory, gameButton.style.backgroundImage);
}


function showConfirmationPrompt(gameName, gameDirectory) {
    const blackoutDiv = document.createElement('div');
    blackoutDiv.classList.add('blackout');
    
    const promptDiv = document.createElement('div');
    promptDiv.classList.add('confirmation-prompt');
    promptDiv.innerHTML = `
        <div class="prompt-content">
            <h2>download game</h2>
            <p>would you like to download ${gameName}? you'll be able to load this game when you don't have an internet connection.</p>
            <button id="confirm-yes">yes</button>
            <button id="confirm-no">no</button>
        </div>
    `;

    document.body.appendChild(blackoutDiv);
    document.body.appendChild(promptDiv);

    document.getElementById('confirm-yes').addEventListener('click', () => {
        promptDiv.querySelector('p').textContent = `preparing to download ${gameName}. please wait..`;
        promptDiv.querySelector('#confirm-yes').remove();
        promptDiv.querySelector('#confirm-no').remove();
        ensureEssentialFiles(promptDiv);

        promptDiv.querySelector('p').textContent = `downloading ${gameName}. speeds vary depending on the game size and your internet connection.`;

        downloadGameFiles(gameName, gameDirectory, promptDiv, blackoutDiv);
    });

    document.getElementById('confirm-no').addEventListener('click', () => {
        document.body.removeChild(blackoutDiv);
        document.body.removeChild(promptDiv);
    });

    centerDivOnScroll();
    window.addEventListener('scroll', centerDivOnScroll);
    window.addEventListener('resize', centerDivOnScroll);
}

function centerDivOnScroll() {
    const centerDiv = document.querySelector('.confirmation-prompt');
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;

    const newTopPosition = scrollY + (windowHeight / 2);
    centerDiv.style.top = `${newTopPosition}px`;
}
  
async function downloadGameFiles(gameName, gameDirectory, promptDiv, blackoutDiv) {
    try {
        const response = await fetch('/storage/js/directories.json'); 
        if (!response.ok) {
            throw new Error('failed to fetch list');
        }

        const directoryList = await response.json();
        const gameData = directoryList[gameDirectory];
        if (!gameData || !gameData.files) {
            throw new Error('no files found for game.');
        }

        promptDiv.querySelector('p').textContent = `downloading ${gameName}. speeds vary depending on the game size and your internet connection.`;
        const files = gameData.files;
        const cache = await caches.open('game-cache');

        for (const file of files) {
            const fileResponse = await fetch(file);
            await cache.put(file, fileResponse.clone());
        }

        const thumbnailUrl = gameData.thumbnail;
        const thumbnailResponse = await fetch(thumbnailUrl);
        await cache.put(thumbnailUrl, thumbnailResponse.clone());

        saveGameToLocal({
            name: gameName,
            directory: gameDirectory,
            thumbnail: thumbnailUrl
        });

        promptDiv.querySelector('p').textContent = `${gameName} has finished downloading! you can now access this game locally by opening the site without an internet connection.`;
        const closeButton = document.createElement('button');
        closeButton.textContent = 'okay';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(blackoutDiv);
            document.body.removeChild(promptDiv);
            window.removeEventListener('scroll', centerDivOnScroll);
            window.removeEventListener('resize', centerDivOnScroll);
        });
        promptDiv.appendChild(closeButton);
    } catch (error) {
        console.error('Error downloading game files:', error);
        promptDiv.querySelector('p').textContent = `there was an error trying to download ${gameName}. try again later, or report the issue to github/discord.`;
        const closeButton = document.createElement('button');
        closeButton.textContent = 'close';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(blackoutDiv);
            document.body.removeChild(promptDiv);
            window.removeEventListener('scroll', centerDivOnScroll);
            window.removeEventListener('resize', centerDivOnScroll);
        });
        promptDiv.appendChild(closeButton);
    }
}

function saveGameToLocal(gameData) {
    const games = JSON.parse(localStorage.getItem('downloadedGames')) || [];
    games.push(gameData);
    localStorage.setItem('downloadedGames', JSON.stringify(games));
}