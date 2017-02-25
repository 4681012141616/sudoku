var remaining, input, countsRef, counts, encode, decode, char, numOfLetters, letterIndex;

function parseInput() {
  remaining = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  input = $('input').val();
  countsRef = {};
  encode = {};
  decode = {};

  for (var i in input) {
    char = input[i].toUpperCase();
    if (char == ' ') continue;
    if (countsRef[char] == undefined) {
      countsRef[char] = 1;
    } else countsRef[char] += 1;
    letterIndex = remaining.indexOf(char);
    if (letterIndex >= 0)
      remaining = remaining.slice(0,letterIndex) + remaining.slice(letterIndex+1);
  }

  numOfLetters = Object.keys(countsRef).length;
  if (numOfLetters > 9) {
    alert('Too many different letters!');
    return false;
  } else
    for (var i=0; i<9-numOfLetters; i++) {
      letterIndex = Math.floor(Math.random()*(remaining.length));
      countsRef[remaining[letterIndex]] = 0;
      remaining = remaining.slice(0,letterIndex) + remaining.slice(letterIndex+1);
    }

  letterIndex = 1;
  for (var letter in countsRef) {
    if (countsRef[letter] > 9) {
      alert("Too many '" + letter + "'s");
      return false;
    }
    countsRef[letter] = 9-countsRef[letter];
    encode[letterIndex] = letter;
    decode[letter] = ''+letterIndex;
    letterIndex++;
  }
  refreshCounts();
  return true;
}


function refreshCounts() {
  counts = {};
  for (var letter in countsRef)
    counts[letter] = countsRef[letter];
}