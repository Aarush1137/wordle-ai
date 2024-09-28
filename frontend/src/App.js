import './App.css';
// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [guessedWord, setGuessedWord] = useState('');
  const [correctLetters, setCorrectLetters] = useState([null, null, null, null, null]);
  const [misplacedLetters, setMisplacedLetters] = useState({});
  const [incorrectLetters, setIncorrectLetters] = useState([]);
  const [nextWord, setNextWord] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for the backend
    const data = {
      correctLetters,
      misplacedLetters,
      incorrectLetters
    };

    axios.post('http://localhost:5000/api/get-next-word', data)
      .then((response) => {
        setNextWord(response.data.nextWord);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  return (
    <div>
      <h1>Wordle AI Assistant</h1>

      {/* Form to input guessed word and feedback */}
      <form onSubmit={handleSubmit}>
        <label>
          Guessed Word:
          <input
            type="text"
            value={guessedWord}
            onChange={(e) => setGuessedWord(e.target.value)}
          />
        </label>
        {/* Add inputs for correctLetters, misplacedLetters, and incorrectLetters */}
        {/* For simplicity, you can manually input these or create interactive components */}
        <button type="submit">Get Next Word</button>
      </form>

      {/* Display the next suggested word */}
      {nextWord && (
        <div>
          <h2>Next Suggested Word:</h2>
          <p>{nextWord}</p>
        </div>
      )}
    </div>
  );
}

export default App;