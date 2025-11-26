# Wordle Clone 🎯

A Python web application that recreates the popular Wordle game using Flask, HTML, CSS, and JavaScript.

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎮 Live Demo

[Try it live!](your-deployment-url-here) *(Replace with your deployment URL)*

## ✨ Features

- 🎯 **Classic Wordle Gameplay**: 6 attempts to guess a 5-letter word
- 🎨 **Authentic UI**: Dark theme with color-coded feedback (green, yellow, gray)
- ⌨️ **Interactive Keyboard**: On-screen keyboard with letter status tracking
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔄 **Session Persistence**: Game state maintained across page refreshes
- 🆕 **New Game Feature**: Start fresh games anytime
- 📅 **Daily Word**: Each day has a consistent word based on the date
- 🎯 **Try Counter**: Visual indicator showing remaining attempts

## How to Play

1. Guess a 5-letter word by typing or clicking the on-screen keyboard
2. Press ENTER to submit your guess
3. Color feedback will show:
   - 🟩 **Green**: Letter is correct and in the right position
   - 🟨 **Yellow**: Letter is in the word but in the wrong position
   - ⬜ **Gray**: Letter is not in the word
4. You have 6 attempts to guess the word
5. Click "New Game" to start over

## Project Structure

```
Wordle/
├── app.py                 # Flask backend with game logic
├── requirements.txt       # Python dependencies
├── static/
│   ├── style.css         # Game styling and animations
│   └── script.js         # Frontend game logic and interactions
├── templates/
│   └── index.html        # Main game interface
└── .github/
    └── copilot-instructions.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/WangLongJimmy/wordle-clone.git
   cd wordle-clone
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

### Alternative Installation with Virtual Environment (Recommended)

```bash
# Clone the repository
git clone https://github.com/WangLongJimmy/wordle-clone.git
cd wordle-clone

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

## VS Code Development

This project includes VS Code tasks for easy development:

- **Run Flask Development Server**: Use `Ctrl+Shift+P` → "Tasks: Run Task" → "Run Flask Development Server"

## Game Logic

- **Word Validation**: Only accepts valid 5-letter words from the built-in word list
- **Daily Consistency**: Uses date-based seeding for consistent daily words
- **Smart Feedback**: Handles duplicate letters correctly (e.g., if the word is "APPLE" and you guess "ALLEY", only the first 'L' will be yellow)
- **Session Management**: Game state persists using Flask sessions

## API Endpoints

- `GET /` - Main game interface
- `POST /api/new-game` - Start a new game
- `POST /api/guess` - Submit a guess
- `GET /api/game-state` - Get current game state

## Technologies Used

- **Backend**: Python, Flask
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with animations and responsive design
- **State Management**: Flask sessions

## Word List

The game includes a curated list of common 5-letter words. The word list can be easily expanded by adding words to the `WORD_LIST` in `app.py`.

## 🛠️ Development

### Project Structure
```
wordle-clone/
├── app.py              # Flask backend with game logic
├── requirements.txt    # Python dependencies
├── static/
│   ├── style.css      # Game styling and animations
│   └── script.js      # Frontend game logic
├── templates/
│   └── index.html     # Main game interface
├── .gitignore         # Git ignore file
└── README.md          # This file
```

### Technical Details
- **Backend**: Flask with session-based state management
- **Frontend**: Vanilla JavaScript with CSS animations
- **Word Validation**: Built-in dictionary with 500+ words
- **Daily Words**: Date-seeded random word selection
- **Responsive Design**: CSS Grid and Flexbox layout

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🚀 Deployment

This app can be easily deployed to various platforms:

- **Heroku**: Add a `Procfile` with `web: python app.py`
- **Railway**: Deploy directly from GitHub
- **PythonAnywhere**: Upload files and configure WSGI
- **Vercel**: Use with serverless functions

## 🎯 Future Enhancements

- [ ] Statistics tracking (games played, win rate, etc.)
- [ ] Share functionality with emoji grid
- [ ] Multiple difficulty levels
- [ ] Custom word lists
- [ ] Dark/light theme toggle
- [ ] Multiplayer functionality
- [ ] Accessibility improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- Inspired by the original [Wordle](https://www.nytimes.com/games/wordle/) by Josh Wardle
- Built with ❤️ using Flask and vanilla JavaScript

---

**⭐ If you enjoyed this project, please give it a star!**