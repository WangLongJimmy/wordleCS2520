class WordleGame {
    constructor() {
        this.currentRow = 0;
        this.currentTile = 0;
        this.gameBoard = document.getElementById('game-board');
        this.keyboard = document.getElementById('keyboard');
        this.message = document.getElementById('message');
        this.triesLeft = document.getElementById('tries-left');
        this.triesLeftBottom = document.getElementById('tries-left-bottom');
        this.gameOver = false;
        this.maxTries = 6;
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.createKeyboard();
        this.loadGameState();
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
    }
    
    createBoard() {
        this.gameBoard.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            row.id = `row-${i}`;
            
            for (let j = 0; j < 5; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.id = `tile-${i}-${j}`;
                row.appendChild(tile);
            }
            
            this.gameBoard.appendChild(row);
        }
    }
    
    createKeyboard() {
        const keys = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
        ];
        
        this.keyboard.innerHTML = '';
        
        keys.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyElement = document.createElement('button');
                keyElement.className = 'key';
                keyElement.textContent = key;
                keyElement.id = `key-${key}`;
                
                if (key === 'ENTER' || key === 'BACKSPACE') {
                    keyElement.classList.add('wide');
                }
                
                keyElement.addEventListener('click', () => this.handleKeyClick(key));
                keyboardRow.appendChild(keyElement);
            });
            
            this.keyboard.appendChild(keyboardRow);
        });
    }
    
    handleKeyPress(e) {
        if (this.gameOver) return;
        
        const key = e.key.toUpperCase();
        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else if (key.match(/^[A-Z]$/) && key.length === 1) {
            this.addLetter(key);
        }
    }
    
    handleKeyClick(key) {
        if (this.gameOver) return;
        
        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else {
            this.addLetter(key);
        }
    }
    
    updateTriesLeft(remaining) {
        const triesText = remaining === 1 ? 'try' : 'tries';
        const displayText = `${remaining} ${triesText} left`;
        
        if (this.triesLeft) {
            this.triesLeft.textContent = displayText;
            this.triesLeft.className = 'tries-counter';
            if (remaining <= 1) this.triesLeft.classList.add('danger');
            else if (remaining <= 2) this.triesLeft.classList.add('warning');
        }
        
        if (this.triesLeftBottom) {
            this.triesLeftBottom.textContent = displayText;
            this.triesLeftBottom.className = 'tries-counter-bottom';
            if (remaining <= 1) this.triesLeftBottom.classList.add('danger');
            else if (remaining <= 2) this.triesLeftBottom.classList.add('warning');
        }
    }
    
    addLetter(letter) {
        if (this.gameOver || this.currentRow >= 6 || this.currentTile >= 5) return;
        const tile = document.getElementById(`tile-${this.currentRow}-${this.currentTile}`);
        if (tile) {
            tile.textContent = letter.toUpperCase();
            tile.classList.add('filled');
            this.currentTile++;
        }
    }
    
    deleteLetter() {
        if (this.currentTile > 0) {
            this.currentTile--;
            const tile = document.getElementById(`tile-${this.currentRow}-${this.currentTile}`);
            if (tile) {
                tile.textContent = '';
                tile.classList.remove('filled');
            }
        }
    }
    
    async submitGuess() {
        if (this.currentTile !== 5) {
            this.showMessage('Not enough letters', 'error');
            return;
        }

        // Collect and normalize guess
        const guess = [];
        for (let i = 0; i < 5; i++) {
            const tile = document.getElementById(`tile-${this.currentRow}-${i}`);
            const letter = tile.textContent.trim().toUpperCase();
            if (!letter) {
                this.showMessage('Empty tile detected', 'error');
                return;
            }
            guess.push(letter);
        }
        const guessWord = guess.join('');

        try {
            const response = await fetch('/api/guess', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guess: guessWord })
            });
            const data = await response.json();

            if (!response.ok) {
                this.showMessage(data.error, 'error');
                return;
            }

            this.updateRow(this.currentRow, data.result);
            this.updateKeyboard(data.result);

            if (data.game_over) {
                this.gameOver = true;
                if (data.won) this.showMessage('Congratulations! You won!', 'success');
                else this.showMessage(`Game Over! The word was: ${data.target_word}`, 'error');
                this.updateTriesLeft(0);
            } else {
                this.currentRow++;
                this.currentTile = 0;
                this.updateTriesLeft(data.guesses_remaining);
                this.showMessage(`${data.guesses_remaining} ${data.guesses_remaining === 1 ? 'guess' : 'guesses'} remaining`, 'info');
            }

        } catch (error) {
            console.error('Error submitting guess:', error);
            this.showMessage('Error submitting guess', 'error');
        }
    }
    
    updateRow(row, result) {
        result.forEach((letterResult, index) => {
            const tile = document.getElementById(`tile-${row}-${index}`);
            if (tile) {
                tile.textContent = letterResult.letter;
                tile.classList.add('flip');
                setTimeout(() => {
                    tile.classList.add(letterResult.status, 'filled');
                    tile.classList.remove('flip');
                }, 300);
            }
        });
    }
    
    updateKeyboard(result) {
        result.forEach(letterResult => {
            const keyElement = document.getElementById(`key-${letterResult.letter}`);
            if (keyElement && !keyElement.classList.contains('correct')) {
                if (letterResult.status === 'correct' || 
                    (letterResult.status === 'present' && !keyElement.classList.contains('present'))) {
                    keyElement.classList.remove('absent', 'present', 'correct');
                    keyElement.classList.add(letterResult.status);
                } else if (letterResult.status === 'absent' && 
                           !keyElement.classList.contains('present') && 
                           !keyElement.classList.contains('correct')) {
                    keyElement.classList.add('absent');
                }
            }
        });
    }
    
    showMessage(text, type) {
        this.message.textContent = text;
        this.message.className = `message ${type}`;
        if ((type !== 'success' && type !== 'error') || text.includes('remaining')) {
            setTimeout(() => {
                this.message.textContent = '';
                this.message.className = 'message';
            }, 3000);
        }
    }
    
    async newGame() {
    try {
        const response = await fetch('/api/new-game', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            this.resetGame();
            await this.loadGameState();   // <<----- ADD THIS LINE
            this.showMessage('New game started!', 'info');
        }
    } catch (error) {
        console.error('Error starting new game:', error);
        this.showMessage('Error starting new game', 'error');
    }
}

    
    resetGame() {
    this.currentRow = 0;
    this.currentTile = 0;
    this.gameOver = false;

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const tile = document.getElementById(`tile-${i}-${j}`);
            if (tile) {
                tile.className = 'tile';
                tile.textContent = '';
            }
        }
    }

    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.className = key.textContent === 'ENTER' || key.textContent === 'BACKSPACE'
            ? 'key wide'
            : 'key';
    });

    this.message.textContent = '';
    this.message.className = 'message';
    this.updateTriesLeft(this.maxTries);
}

    
    async loadGameState() {
        try {
            const response = await fetch('/api/game-state');
            const data = await response.json();

            if (data.guesses && data.guesses.length > 0) {
                data.guesses.forEach((guess, rowIndex) => {
                    guess.result.forEach((letterResult, colIndex) => {
                        const tile = document.getElementById(`tile-${rowIndex}-${colIndex}`);
                        tile.textContent = letterResult.letter;
                        tile.classList.add('filled', letterResult.status);
                    });
                    this.updateKeyboard(guess.result);
                });

                this.currentRow = data.guesses.length;
                this.currentTile = 0;

                if (data.game_over) {
                    this.gameOver = true;
                    this.updateTriesLeft(0);
                    if (data.won) this.showMessage('Congratulations! You won!', 'success');
                    else this.showMessage(`Game Over! The word was: ${data.target_word}`, 'error');
                } else {
                    this.updateTriesLeft(data.guesses_remaining);
                    this.showMessage(`${data.guesses_remaining} ${data.guesses_remaining === 1 ? 'guess' : 'guesses'} remaining`, 'info');
                }
            } else {
                this.updateTriesLeft(this.maxTries);
            }
        } catch (error) {
            console.error('Error loading game state:', error);
            this.updateTriesLeft(this.maxTries);
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => new WordleGame());