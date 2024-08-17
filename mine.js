const NUM_ROWS = 9;
const NUM_COLS = 9;
const NUM_MINES = 9;

let board = [];

function initializeBoard() {
    for (let row = 0; row < NUM_ROWS; ++row) {
        board[row] = [];
        for (let col = 0; col < NUM_COLS; ++col) {
            board[row][col] = {
                isMine: false,
                isRevealed: false,
                count: 0
            };
        }
    }

    // Randomly place mines
    let mines = 0;
    while (mines < NUM_MINES) {
        const randomRow = Math.floor(Math.random() * NUM_ROWS);
        const randomCol = Math.floor(Math.random() * NUM_COLS);

        if (!board[randomRow][randomCol].isMine) {
            board[randomRow][randomCol].isMine = true;
            mines++;
        }
    }

    // Calculate adjacent mines count
    for (let row = 0; row < NUM_ROWS; ++row) {
        for (let col = 0; col < NUM_COLS; ++col) {
            if (!board[row][col].isMine) {
                let count = 0;
                // Check 8 possible directions
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const iLoc = row + dx;
                        const jLoc = col + dy;

                        if (iLoc >= 0 && iLoc < NUM_ROWS && jLoc >= 0 && jLoc < NUM_COLS) {
                            if (board[iLoc][jLoc].isMine) {
                                count++;
                            }
                        }
                    }
                }
                board[row][col].count = count;
            }
        }
    }
}

const gameBoard = document.getElementById("game-board");
const newGameButton = document.getElementById("new-game-button");

function render() {
    gameBoard.innerHTML = "";
    for (let row = 0; row < NUM_ROWS; ++row) {
        for (let col = 0; col < NUM_COLS; ++col) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (board[row][col].isRevealed) {
                tile.classList.add('revealed');
                if (board[row][col].isMine) {
                    tile.classList.add('mine');
                    tile.textContent = '💣';
                } else if (board[row][col].count > 0) {
                    tile.textContent = board[row][col].count;
                }
            }
            tile.addEventListener('click', () => revealTile(row, col));
            gameBoard.appendChild(tile);
        }
        gameBoard.appendChild(document.createElement('br'));
    }
}

function revealTile(row, col) {
    if (row >= 0 && row < NUM_ROWS && col >= 0 && col < NUM_COLS && !board[row][col].isRevealed) {
        board[row][col].isRevealed = true;

        if (board[row][col].isMine) {
            // Reveal all mines
            for (let r = 0; r < NUM_ROWS; ++r) {
                for (let c = 0; c < NUM_COLS; ++c) {
                    if (board[r][c].isMine) {
                        board[r][c].isRevealed = true;
                    }
                }
            }
            alert('Game Over: You stepped on a mine!');
            if (confirm("Game Over! Do you want to play again?")) {
                reset();
            }
        } else if (board[row][col].count === 0) {
            // Recursive reveal neighboring tiles
            for (let dx = -1; dx <= 1; ++dx) {
                for (let dy = -1; dy <= 1; ++dy) {
                    revealTile(row + dx, col + dy);
                }
            }
        }
        render(); // Update the board after each reveal
    }
}

function reset(){
    board = [];
    initializeBoard();
    render();
    alert("New Game!");
}

newGameButton.addEventListener('click', reset);

// Initialize and render the board
initializeBoard();
render();