// frontend/src/App.js

import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';

const LetterInput = styled(TextField)(({ theme }) => ({
  width: '50px',
  marginRight: '5px',
  '& input': {
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    padding: '10px',
    color: '#fff',
  },
}));

function App() {
  const [correctLetters, setCorrectLetters] = useState(['', '', '', '', '']);
  const [misplacedLetters, setMisplacedLetters] = useState({});
  const [incorrectLetters, setIncorrectLetters] = useState('');
  const [nextWordsData, setNextWordsData] = useState([]);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showOpeningWords, setShowOpeningWords] = useState(true); // New state variable

  const correctRefs = useRef([]);
  const misplacedRefs = useRef([]);

  // Opening words to display at the start
  const openingWords = ['canoe', 'strip', 'fugly', 'crane', 'slate', 'toils'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hide opening words after submission
    setShowOpeningWords(false);

    // Prepare data for the backend
    const data = {
      correctLetters: correctLetters.map((letter) => letter || null),
      misplacedLetters,
      incorrectLetters: incorrectLetters.split('').filter((letter) => letter),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/get-next-words', data);
      setNextWordsData(response.data.nextWords);
      setError('');
    } catch (error) {
      console.error('There was an error!', error);
      setError('An error occurred while fetching the next words.');
    }
  };

  // Functions to update the letter arrays

  const updateCorrectLetters = (index, value) => {
    const newCorrectLetters = [...correctLetters];
    const letter = value.toLowerCase();

    // Remove the letter from incorrect letters if present
    if (incorrectLetters.includes(letter)) {
      setIncorrectLetters((prev) => prev.replace(new RegExp(letter, 'g'), ''));
    }

    newCorrectLetters[index] = letter;
    setCorrectLetters(newCorrectLetters);
    setValidationError('');

    // Auto-focus to the next input
    if (letter && index < 4) {
      correctRefs.current[index + 1].focus();
    }
  };

  const updateMisplacedLetters = (index, value) => {
    const newMisplacedLetters = { ...misplacedLetters };
    const letter = value.toLowerCase();

    if (letter) {
      // Remove the letter from incorrect letters if present
      if (incorrectLetters.includes(letter)) {
        setIncorrectLetters((prev) => prev.replace(new RegExp(letter, 'g'), ''));
      }

      newMisplacedLetters[index] = letter;
    } else {
      delete newMisplacedLetters[index];
    }
    setMisplacedLetters(newMisplacedLetters);
    setValidationError('');

    // Auto-focus to the next input
    if (letter && index < 4) {
      misplacedRefs.current[index + 1].focus();
    }
  };

  const handleIncorrectLettersChange = (e) => {
    const input = e.target.value.toLowerCase().replace(/[^a-z]/g, '');

    // Check for letters that are already in correct or misplaced letters
    const allUsedLetters = [
      ...correctLetters.filter((letter) => letter),
      ...Object.values(misplacedLetters),
    ];

    const duplicateLetters = allUsedLetters.filter((letter) => input.includes(letter));

    if (duplicateLetters.length > 0) {
      setValidationError(
        `The letter(s) "${duplicateLetters.join(', ').toUpperCase()}" cannot be in Incorrect Letters because they are already in Correct or Misplaced Letters.`
      );
      // Remove duplicate letters from the input
      const filteredInput = input
        .split('')
        .filter((letter) => !duplicateLetters.includes(letter))
        .join('');
      setIncorrectLetters(filteredInput);
    } else {
      setIncorrectLetters(input);
      setValidationError('');
    }
  };

  const clearCorrectLetters = () => {
    setCorrectLetters(['', '', '', '', '']);
    setValidationError('');
  };

  const clearMisplacedLetters = () => {
    setMisplacedLetters({});
    setValidationError('');
  };

  const clearIncorrectLetters = () => {
    setIncorrectLetters('');
    setValidationError('');
  };

  // Create a dark theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      primary: {
        main: '#90caf9',
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="md" sx={{ marginTop: '40px' }}>
        <Paper elevation={3} sx={{ padding: '30px', backgroundColor: darkTheme.palette.background.paper }}>
          <Typography variant="h4" align="center" gutterBottom>
            🔎 Wordle AI Assistant
          </Typography>

            {showOpeningWords && (
              <Box sx={{ marginBottom: '30px' }}>
              <Typography variant="h6" gutterBottom>
              🔮 Suggested Opening Words:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
              {openingWords.map((word, index) => (
                <Box key={index} sx={{ marginRight: '10px' }}>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: '18px', fontWeight: 'bold' }}
                  >
                    {word.toUpperCase()}
          </Typography>
                  </Box>
              ))}
            </Box>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Enter Feedback:
            </Typography>

            {/* Correct Letters Section */}
            <Box sx={{ marginBottom: '20px', position: 'relative' }}>
              <Typography variant="subtitle1">Correct Letters (Green):</Typography>
              <Button
                onClick={clearCorrectLetters}
                sx={{ position: 'absolute', right: 0, top: 0 }}
                color="primary"
                variant="text"
              >
                Clear
              </Button>
              <Box sx={{ display: 'flex', marginTop: '10px' }}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <LetterInput
                    key={`correct-${index}`}
                    variant="outlined"
                    inputProps={{ maxLength: 1 }}
                    value={correctLetters[index]}
                    onChange={(e) => updateCorrectLetters(index, e.target.value)}
                    inputRef={(el) => (correctRefs.current[index] = el)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#6aaa64',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Misplaced Letters Section */}
            <Box sx={{ marginBottom: '20px', position: 'relative' }}>
              <Typography variant="subtitle1">Misplaced Letters (Yellow):</Typography>
              <Button
                onClick={clearMisplacedLetters}
                sx={{ position: 'absolute', right: 0, top: 0 }}
                color="primary"
                variant="text"
              >
                Clear
              </Button>
              <Box sx={{ display: 'flex', marginTop: '10px' }}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <LetterInput
                    key={`misplaced-${index}`}
                    variant="outlined"
                    inputProps={{ maxLength: 1 }}
                    value={misplacedLetters[index] || ''}
                    onChange={(e) => updateMisplacedLetters(index, e.target.value)}
                    inputRef={(el) => (misplacedRefs.current[index] = el)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#c9b458',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Incorrect Letters Section */}
            <Box sx={{ marginBottom: '20px', position: 'relative' }}>
              <Typography variant="subtitle1">Incorrect Letters (Gray):</Typography>
              <Button
                onClick={clearIncorrectLetters}
                sx={{ position: 'absolute', right: 0, top: 0 }}
                color="primary"
                variant="text"
              >
                Clear
              </Button>
              <TextField
                variant="outlined"
                placeholder="Enter letters without spaces"
                value={incorrectLetters.toUpperCase()}
                onChange={handleIncorrectLettersChange}
                inputProps={{ style: { textTransform: 'uppercase' } }}
                fullWidth
                sx={{ marginTop: '10px' }}
              />
            </Box>

            {validationError && (
              <Alert severity="error" sx={{ marginBottom: '20px' }}>
                {validationError}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={!!validationError}
            >
              Get Next Words
            </Button>
          </form>

          {/* Display the Suggested Words with Scores */}
          {nextWordsData.length > 0 && (
            <Box sx={{ marginTop: '30px' }}>
              <Typography variant="h6" gutterBottom>
                🔮 Next Suggested Words:
              </Typography>
              <List>
                {nextWordsData.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${item.word.toUpperCase()} - Score: ${item.score.toFixed(2)}`}
                      primaryTypographyProps={{ fontSize: '18px', fontWeight: 'bold' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ marginTop: '20px' }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
