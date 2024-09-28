# backend/wordle_ai.py

import sys
import json
from collections import Counter

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

def calculate_letter_frequencies(words):
    # Count frequency of each letter in all words
    letter_counts = Counter()
    for word in words:
        # Use set to avoid counting duplicate letters in the same word
        unique_letters = set(word)
        letter_counts.update(unique_letters)
    return letter_counts

def score_words(possible_words, letter_frequencies):
    word_scores = []
    for word in possible_words:
        # Sum the frequencies of the unique letters in the word
        score = sum(letter_frequencies[letter] for letter in set(word))
        word_scores.append({'word': word, 'score': score})
    # Sort words by score in descending order
    word_scores.sort(key=lambda x: x['score'], reverse=True)
    return word_scores

def suggest_next_words(possible_words, n=6):
    if not possible_words:
        return [{"word": "No possible words found.", "score": 0}]
    # Calculate letter frequencies in possible words
    letter_frequencies = calculate_letter_frequencies(possible_words)
    # Score the possible words
    scored_words = score_words(possible_words, letter_frequencies)
    # Return the top n words with their scores
    return scored_words[:n]

if __name__ == "__main__":
    # Expecting JSON strings as command-line arguments
    correct_letters = json.loads(sys.argv[1])         # List of 5 elements
    misplaced_letters = json.loads(sys.argv[2])       # Dictionary with indices as keys (strings)
    incorrect_letters = json.loads(sys.argv[3])       # List of letters

    possible_words = get_possible_words(correct_letters, misplaced_letters, incorrect_letters)
    next_words = suggest_next_words(possible_words, n=6)  # Suggest top 6 words
    # Output the list of suggested words with their scores as a JSON string
    print(json.dumps(next_words))
