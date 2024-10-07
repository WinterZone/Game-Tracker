let games = [];
let currentEditIndex = null;  // Keeps track of which game is being edited

function addGame() {
    const title = document.getElementById('game-title').value;
    const status = document.getElementById('game-status').value;
    const rating = document.getElementById('game-rating').value;

    if (title && rating) {
        const game = {
            title,
            status,
            rating
        };
        games.push(game);
        saveToLocalStorage(); // Save the updated games array to localStorage
        displayGames();
        clearForm(); // Clear the form after adding
    } else {
        alert('Please fill in all fields!');
    }
}

function editGame(index) {
    currentEditIndex = index;

    const game = games[index];

    document.getElementById('edit-game-title').value = game.title;
    document.getElementById('edit-game-status').value = game.status;
    document.getElementById('edit-game-rating').value = game.rating;

    document.querySelector('.edit-form').style.display = 'block';
}

function saveGame() {
    const title = document.getElementById('edit-game-title').value;
    const status = document.getElementById('edit-game-status').value;
    const rating = document.getElementById('edit-game-rating').value;

    if (title && rating) {
        games[currentEditIndex] = {
            title,
            status,
            rating
        };

        document.querySelector('.edit-form').style.display = 'none';

        saveToLocalStorage(); // Save the updated games array to localStorage
        displayGames();
    } else {
        alert('Please fill in all fields!');
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
                <strong>${game.title}</strong> - ${game.status} 
                <span class="game-rating">★ ${game.rating}</span>
                <button onclick="editGame(${index})">Edit</button>
                <button onclick="deleteGame(${index})">Delete</button>
            </li>
        `;
    });
}

function saveToLocalStorage() {
    localStorage.setItem('games', JSON.stringify(games));
}

function loadFromLocalStorage() {
    const storedGames = localStorage.getItem('games');
    if (storedGames) {
        games = JSON.parse(storedGames);
        displayGames();
    }
}

// Call this function when the page loads
loadFromLocalStorage();

function clearForm() {
    document.getElementById('game-title').value = '';
    document.getElementById('game-rating').value = '';
    document.getElementById('game-status').value = 'Playing';
}
