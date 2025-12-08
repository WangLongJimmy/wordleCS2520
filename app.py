from flask import Flask, render_template, request, jsonify, session
import random
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')

# -------------------------------
# Load Word Lists
# -------------------------------

# Wordle official answers (the answer list)
ANSWER_LIST = []
with open('wordle-answers-alphabetical.txt', 'r') as f:
    ANSWER_LIST = [line.strip().upper() for line in f if len(line.strip()) == 5]

# Wordle allowed guesses
ALLOWED_GUESSES = []
with open('wordle-allowed-guesses.txt', 'r') as f:
    ALLOWED_GUESSES = [line.strip().upper() for line in f if len(line.strip()) == 5]

# Allowed guesses set = allowed + answers (official Wordle rule)
VALID_GUESSES = set(ANSWER_LIST) | set(ALLOWED_GUESSES)

# -------------------------------
# Choose Daily Word
# -------------------------------
def get_daily_word():
    """Selects the daily Wordle word using the system date."""
    today = datetime.now().date()
    random.seed(today.toordinal())
    return random.choice(ANSWER_LIST)


# -------------------------------
# Wordle Checking Logic
# -------------------------------
def check_guess(guess, target_word):
    """Check guess vs target and return Wordle-like feedback."""
    result = []
    guess = guess.upper()
    target_word = target_word.upper()

    # Count letters in the target word
    letter_count = {}
    for letter in target_word:
        letter_count[letter] = letter_count.get(letter, 0) + 1

    # First pass: correct locations
    for i, letter in enumerate(guess):
        if letter == target_word[i]:
            result.append({"letter": letter, "status": "correct"})
            letter_count[letter] -= 1
        else:
            result.append({"letter": letter, "status": "temp"})

    # Second pass: present / absent
    for i, entry in enumerate(result):
        if entry["status"] == "temp":
            letter = entry["letter"]
            if letter in letter_count and letter_count[letter] > 0:
                entry["status"] = "present"
                letter_count[letter] -= 1
            else:
                entry["status"] = "absent"

    return result


# -------------------------------
# Routes
# -------------------------------

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/new-game', methods=['POST'])
def new_game():
    session['target_word'] = get_daily_word()
    session['guesses'] = []
    session['game_over'] = False
    session['won'] = False
    return jsonify({"message": "New game started"})


@app.route('/api/guess', methods=['POST'])
def make_guess():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request, JSON expected"}), 400

    guess = data.get("guess", "").upper()

    # --- Validation ---
    if len(guess) != 5:
        return jsonify({"error": "Guess must be 5 letters"}), 400

    if not guess.isalpha():
        return jsonify({"error": "Guess must contain only letters"}), 400

    if guess not in VALID_GUESSES:
        return jsonify({"error": "Not a valid word"}), 400

    # Initialize game state if missing
    if 'target_word' not in session or 'guesses' not in session:
        session['target_word'] = get_daily_word()
        session['guesses'] = []
        session['game_over'] = False
        session['won'] = False


    # Check if the game is already over
    if session.get('game_over', False):
        return jsonify({"error": "Game is already over"}), 400

    target_word = session['target_word']
    result = check_guess(guess, target_word)

    # Save the guess
    guesses = session.get('guesses', [])
    guesses.append({
    "word": guess,
    "result": result
    })
    session['guesses'] = guesses   # <-- forces session update

    # Win / Lose logic
    if guess == target_word:
        session['won'] = True
        session['game_over'] = True
    elif len(session['guesses']) >= 6:
        session['game_over'] = True

    return jsonify({
        "result": result,
        "game_over": session['game_over'],
        "won": session['won'],
        "target_word": target_word if session['game_over'] else None,
        "guesses_remaining": 6 - len(session['guesses'])
    })


@app.route('/api/game-state')
def game_state():
    return jsonify({
        "guesses": session.get("guesses", []),
        "game_over": session.get("game_over", False),
        "won": session.get("won", False),
        "target_word": session["target_word"] if session.get("game_over", False) else None,
        "guesses_remaining": 6 - len(session.get("guesses", []))
    })


# -------------------------------
# Run App
# -------------------------------
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)