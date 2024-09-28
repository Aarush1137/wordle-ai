// frontend/src/App.js

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [correctLetters, setCorrectLetters] = useState(['', '', '', '', '']);
  const [misplacedLetters, setMisplacedLetters] = useState({});
  const [incorrectLetters, setIncorrectLetters] = useState('');
  const [nextWords, setNextWords] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for the backend
    const data = {
      correctLetters: correctLetters.map(letter => letter || null),
      misplacedLetters,
      incorrectLetters: incorrectLetters.split('').filter(letter => letter)
    };

    try {
      const response = await axios.post('http://localhost:5000/api/get-next-words', data);
      setNextWords(response.data.nextWords);
      setError('');
    } catch (error) {
      console.error('There was an error!', error);
      setError('An error occurred while fetching the next words.');
    }
  };

  // Functions to update the letter arrays
  const updateCorrectLetters = (index, value) => {
    const newCorrectLetters = [...correctLetters];
    newCorrectLetters[index] = value.toLowerCase();
    setCorrectLetters(newCorrectLetters);
  };

  const updateMisplacedLetters = (index, value) => {
    const newMisplacedLetters = { ...misplacedLetters };
    if (value) {
      newMisplacedLetters[index] = value.toLowerCase();
    } else {
      delete newMisplacedLetters[index];
    }
    setMisplacedLetters(newMisplacedLetters);
  };

  const handleIncorrectLettersChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
    setIncorrectLetters(value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Wordle AI Assistant</h1>

      <form onSubmit={handleSubmit}>
        <h2>Enter Feedback:</h2>

        <div>
          <h3>Correct Letters (Green):</h3>
          {[0, 1, 2, 3, 4].map((index) => (
            <input
              key={`correct-${index}`}
              type="text"
              maxLength="1"
              value={correctLetters[index]}
              onChange={(e) => updateCorrectLetters(index, e.target.value)}
              style={{
                width: '30px',
                height: '30px',
                textAlign: 'center',
                marginRight: '5px',
                backgroundColor: '#6aaa64',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: '15px' }}>
          <h3>Misplaced Letters (Yellow):</h3>
          {[0, 1, 2, 3, 4].map((index) => (
            <input
              key={`misplaced-${index}`}
              type="text"
              maxLength="1"
              value={misplacedLetters[index] || ''}
              onChange={(e) => updateMisplacedLetters(index, e.target.value)}
              style={{
                width: '30px',
                height: '30px',
                textAlign: 'center',
                marginRight: '5px',
                backgroundColor: '#c9b458',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: '15px' }}>
          <h3>Incorrect Letters (Gray):</h3>
          <input
            type="text"
            value={incorrectLetters}
            onChange={handleIncorrectLettersChange}
            placeholder="Enter letters without spaces"
            style={{
              width: '200px',
              height: '30px',
              textAlign: 'center',
              fontSize: '16px',
              textTransform: 'uppercase',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Get Next Words
        </button>
      </form>

      {nextWords.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>Next Suggested Words:</h2>
          <ul>
            {nextWords.map((word, index) => (
              <li key={index} style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {word}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
    </div>
  );
}

export default App;
