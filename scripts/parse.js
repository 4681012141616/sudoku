var remaining, input, countsRef, counts, encode, decode, char, numOfLetters, letterIndex;

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to check and parse the input string
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function parseInput() {
  input = $('input').val();

  // store unused letters in case < 9 are in message
  remaining = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // store counts of each letter used (REFerence for future counters)
  countsRef = {};

  // letters will be mapped to numbers (1-9) for simpler sudoku solving
  // so create hash maps for letter --> number and vice versa
  encode = {};
  decode = {};

  // count and record each letter of the input
  for (var i in input) {
    char = input[i].toUpperCase();
    if (char == ' ') continue;
    // create or increment letter counter
    if (countsRef[char] == undefined) {
      countsRef[char] = 1;
    } else countsRef[char] += 1;
    // remove it from "remaining" alphabet string
    letterIndex = remaining.indexOf(char);
    if (letterIndex >= 0)
      remaining = remaining.slice(0,letterIndex) + remaining.slice(letterIndex+1);
  }

  // check number of unique letters (no more than 9 allowed)
  numOfLetters = Object.keys(countsRef).length;
  if (numOfLetters > 9) {
    alert('Too many different letters!');
    return false;
  // if fewer than 9, make up to 9 by choosing unused letters
  } else if (numOfLetters < 9)
    for (var i=0; i<9-numOfLetters; i++) {
      letterIndex = Math.floor(Math.random()*(remaining.length));
      countsRef[remaining[letterIndex]] = 0;
      remaining = remaining.slice(0,letterIndex) + remaining.slice(letterIndex+1);
    }

  // now check count of each unique letter (no more than 9)
  letterIndex = 1;
  for (var letter in countsRef) {
    if (countsRef[letter] > 9) {
      alert("Too many '" + letter + "'s");
      return false;
    }
    // if few than 9 occurences, change count to (9-count):
    //    it is now how many of given letter can be removed from a full
    //    grid while preserving the letter frequencies of the input
    countsRef[letter] = 9-countsRef[letter];
    // and encode each letter as a number (1-9)
    encode[letterIndex] = letter;
    decode[letter] = ''+letterIndex;
    letterIndex++;
  }

  // create a copy, counts, of countsRef to be edited as a counter in
  // the puzzle-generation phase
  refreshCounts();
  return true;
}


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to create a copy of the letter counts
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function refreshCounts() {
  counts = {};
  for (var letter in countsRef)
    counts[letter] = countsRef[letter];
}