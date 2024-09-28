# backend/wordle_ai.py

import sys
import json

# Function to read words from word.txt
def load_word_list(filename):
    try:
        with open(filename, 'r') as f:
            words = [line.strip().lower() for line in f if line.strip()]
            # Filter words that are exactly 5 letters long
            words = [word for word in words if len(word) == 5]
        return words
    except FileNotFoundError:
        print(f"Error: The file {filename} was not found.")
        sys.exit(1)

# Load the word list from word.txt
WORD_LIST = load_word_list('word.txt')

def get_possible_words(correct_letters, misplaced_letters, incorrect_letters):
    possible_words = []
    for word in WORD_LIST:
        is_possible = True
        # Check for correct letters
        for i in range(5):
            if correct_letters[i]:
                if word[i] != correct_letters[i]:
                    is_possible = False
                    break
        if not is_possible:
            continue
        # Check for misplaced letters
        for index_str, letter in misplaced_letters.items():
            index = int(index_str)
            if word[index] == letter or letter not in word:
                is_possible = False
                break
        if not is_possible:
            continue
        # Check for incorrect letters
        if any(letter in word for letter in incorrect_letters):
            is_possible = False
            continue
        if is_possible:
            possible_words.append(word)
    return possible_words

def suggest_next_words(possible_words, n=5):
    # Return up to 'n' possible words
    return possible_words[:n] if possible_words else ["No possible words found."]

if __name__ == "__main__":
    # Expecting JSON strings as command-line arguments
    correct_letters = json.loads(sys.argv[1])         # List of 5 elements
    misplaced_letters = json.loads(sys.argv[2])       # Dictionary with indices as keys (strings)
    incorrect_letters = json.loads(sys.argv[3])       # List of letters

    possible_words = get_possible_words(correct_letters, misplaced_letters, incorrect_letters)
    next_words = suggest_next_words(possible_words, n=5)
    # Output the list of suggested words as a JSON string
    print(json.dumps(next_words))
