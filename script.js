let games = [];
let currentEditIndex = null;  // Keeps track of which game is being edited

function addGame() {
    const title = document.getElementById('game-title').value;
    const status = document.getElementById('game-status').value;
    const ratingInput = document.getElementById('game-rating');
    const rating = ratingInput.value;
    const imageInput = document.getElementById('game-image');

    if (title) {
        const game = {
            title,
            status,
            rating: (status === 'Completed' || status === '100%') ? rating : null,
            image: null, // We'll set this later
            addedAt: Date.now()
        };

        // Handle image upload
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                game.image = e.target.result;
                games.push(game);
                saveToLocalStorage();
                displayGames();
                clearForm(); // Clear the form after adding
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            games.push(game);
            saveToLocalStorage();
            displayGames();
            clearForm(); // Clear the form after adding
        }
    } else {
        alert('Please fill in the game title!');
    }
}

function editGame(index) {
    currentEditIndex = index;

    const game = games[index];

    document.getElementById('edit-game-title').value = game.title;
    document.getElementById('edit-game-status').value = game.status;
    document.getElementById('edit-game-rating').value = game.rating;
    const ratingInput = document.getElementById('edit-game-rating');
    if (game.status === 'Completed' || game.status === '100%') {
        ratingInput.disabled = false;
    } else {
        ratingInput.disabled = true;
    }

    // Show existing image if any
    if (game.image) {
        document.getElementById('current-image').src = game.image;
        document.getElementById('current-image').style.display = 'block';
    } else {
        document.getElementById('current-image').style.display = 'none';
    }

    document.getElementById('edit-game-image').value = ''; // Reset the file input

    document.querySelector('.edit-form').style.display = 'block';
}

function saveGame() {
    const title = document.getElementById('edit-game-title').value;
    const status = document.getElementById('edit-game-status').value;
    const ratingInput = document.getElementById('edit-game-rating');
    const rating = ratingInput.value;
    const imageInput = document.getElementById('edit-game-image');

    if (title) {
        // Update the game object
        const game = games[currentEditIndex];
        game.title = title;
        game.status = status;
        game.rating = (status === 'Completed' || status === '100%') ? rating : null;

        // Handle image change
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                game.image = e.target.result;
                saveToLocalStorage();
                displayGames();
                document.querySelector('.edit-form').style.display = 'none';
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            // No new image selected, keep existing
            saveToLocalStorage();
            displayGames();
            document.querySelector('.edit-form').style.display = 'none';
        }
    } else {
        alert('Please fill in the game title!');
    }
}

function deleteGame(index) {
    games.splice(index, 1);
    saveToLocalStorage(); // Save the updated games array to localStorage
    displayGames();
}

function displayGames() {
    const gamesContainer = document.getElementById('games-container');
    gamesContainer.innerHTML = '';

    games.forEach((game, index) => {
        gamesContainer.innerHTML += `
            <li class="game-item">
                <div class="game-details">
                    ${game.image ? `<img src="${game.image}" alt="${game.title}" class="game-image">` : ''}
                    <div class="game-info">
                        <strong>${game.title}</strong><br>
                        Status: ${game.status}
                        ${game.rating && (game.status === 'Completed' || game.status === '100%') ? `<br>Rating: ★ ${game.rating}` : ''}
                    </div>
                </div>
                <div class="game-actions">
                    <button onclick="editGame(${index})">Edit</button>
                    <button onclick="deleteGame(${index})">Delete</button>
                </div>
            </li>
        `;
    });
}

function sortGames() {
    const sortBy = document.getElementById('sort-by').value;

    if (sortBy === 'name') {
        games.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'status') {
        games.sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortBy === 'added') {
        games.sort((a, b) => b.addedAt - a.addedAt); // Sort by addedAt in descending order
    }

    displayGames();
}

function saveToLocalStorage() {
    localStorage.setItem('games', JSON.stringify(games));
}

function loadFromLocalStorage() {
    const storedGames = localStorage.getItem('games');
    if (storedGames) {
        games = JSON.parse(storedGames);
        sortGames(); // This will call displayGames()
    }
}

// Call this function when the page loads
loadFromLocalStorage();

function clearForm() {
    document.getElementById('game-title').value = '';
    document.getElementById('game-rating').value = '';
    document.getElementById('game-status').value = 'Want to Buy';
    document.getElementById('game-rating').disabled = true;
    document.getElementById('game-image').value = '';
}

// Add event listeners to status select elements to enable/disable rating input
document.getElementById('game-status').addEventListener('change', function() {
    const status = this.value;
    const ratingInput = document.getElementById('game-rating');
    if (status === 'Completed' || status === '100%') {
        ratingInput.disabled = false;
    } else {
        ratingInput.disabled = true;
        ratingInput.value = '';
    }
});

document.getElementById('edit-game-status').addEventListener('change', function() {
    const status = this.value;
    const ratingInput = document.getElementById('edit-game-rating');
    if (status === 'Completed' || status === '100%') {
        ratingInput.disabled = false;
    } else {
        ratingInput.disabled = true;
        ratingInput.value = '';
    }
});
