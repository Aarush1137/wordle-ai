# wordle_ai.py

import sys
import json

# Predefined list of five words
WORD_LIST = ['apple', 'baker', 'cable', 'delta', 'eagle']

def get_possible_words(correct_letters, misplaced_letters, incorrect_letters):
    possible_words = []
    for word in WORD_LIST:
        is_possible = True
        for i in range(5):
            letter = word[i]
            # Check for correct letters
            if correct_letters[i] and letter != correct_letters[i]:
                is_possible = False
                break
            # Check for misplaced letters
            if letter in misplaced_letters:
                if letter == misplaced_letters[i]:
                    is_possible = False
                    break
            # Check for incorrect letters
            if letter in incorrect_letters:
                is_possible = False
                break
        if is_possible:
            possible_words.append(word)
    return possible_words

def suggest_next_word(possible_words):
    # Simple strategy: pick the first word from the possible words
    if possible_words:
        return possible_words[0]
    else:
        return "No possible words found."

if __name__ == "__main__":
    # Expecting JSON strings as command-line arguments
    correct_letters = json.loads(sys.argv[1])         # List of 5 elements
    misplaced_letters = json.loads(sys.argv[2])       # Dictionary with indices as keys
    incorrect_letters = json.loads(sys.argv[3])       # List of letters

    possible_words = get_possible_words(correct_letters, misplaced_letters, incorrect_letters)
    next_word = suggest_next_word(possible_words)
    print(next_word)
