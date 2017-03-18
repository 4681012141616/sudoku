var attempts, emptyInRow, emptyInCol, emptyInBox, rowFixed, colFixed, boxFixed,
    Nor, Wes, couldBe, indices = [], index, extras, extraIndex, extraVal;


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// listener for "generate" button: create new puzzle
// ––––––––––––––––––––––––––––––––––––––––––––––––––
$('#generate').click(function(){
  // recolour red/blue backgrounds after previous yellow highlights
  colourCells();
  // check input is allowed
  if (!parseInput()) return;
  // initialise attempts counter and start generating puzzles
  attempts = 0; generate();
});


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to generate puzzles until one has the input string in order
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function generate() {

  // reset everything
  clearGrid();
  refreshCounts();

  // fill the grid (default pattern: row swaps will happen later)
  states = [[1,2,3,4,5,6,7,8,9],[7,8,9,1,2,3,4,5,6],[4,5,6,7,8,9,1,2,3],
            [9,1,2,3,4,5,6,7,8],[6,7,8,9,1,2,3,4,5],[3,4,5,6,7,8,9,1,2],
            [8,9,1,2,3,4,5,6,7],[5,6,7,8,9,1,2,3,4],[2,3,4,5,6,7,8,9,1]];

  // iterate through cells randomly, deleting contents if it can
  // be deduced from other clues
  for (var i=0; i<81; i++) indices.push(i);
  for (var i=0; i<81; i++) {
    index = Math.floor(Math.random()*(81-i));
    tryRemove(indices[index]);
    indices.splice(index,1);
  }

  // if current puzzle doesn't have the input in order, try again
  if (!findInput() && ++attempts < 1000) generate();
  // if counter reaches 1000, abort and send failure message
  else if (attempts == 1000) alert('Haven\'t found one in 1000 trials, but you can keep trying');

  // otherwise, puzzle has been found
  else {
    // to finish, try to delete any further clues not needed for the
    // message (will be 2-step deductions or more; need to brute-force)

    // first make a list of indices of possible extraneous clues
    extras = [];
    for (var i=0; i<81; i++)
      // i.e: not highlighted cells, but filled
      if (highlight.indexOf(i) < 0 && $(grid[i]).text() != '')
        extras.push(i);

    // then try to remove each of them in a random order
    while (extras.length > 0) {
      extraIndex = Math.floor(Math.random()*extras.length);
      bruteForceTryRemove(extras[extraIndex]);
      extras.splice(extraIndex,1);
    }
  }
}


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to delete a clue if it can be deduced from others
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function tryRemove( i ) {

  // store indices of empty cells in the same row, column, 3x3 block
  emptyInRow = [];
  emptyInCol = [];
  emptyInBox = [];
  // ... row and column indices
  row = Math.floor(i/9);
  col = i%9;
  // ... value of clue (1-9 corresponding to input letter)
  num = states[row][col];

  // check if enough occurences of the value would remain to reproduce
  // the input string
  if (counts[encode[num]] == 0) return;

  // also store row and column of top-left cell in the 3x3 block
  Nor = 3*Math.floor(row/3);
  Wes = 3*Math.floor(col/3);

  // string to record possible alternative values for cell
  // (if no alternatives, it's ok to remove)
  couldBe = '123456789';

  // use j to iterate through row & column indices
  for (var j=0; j<9; j++) {
    // go through each cell in the same row
    str = states[row][j];
    // if empty, add it to the array of empty cells in the row
    if (str == '') emptyInRow.push(9*row+j);
    // if not empty, cell i cannot have the same value
    else couldBe = couldBe.replace(str,'');

    // do the same for each cell in the same column
    str = states[j][col];
    if (str == '') emptyInCol.push(9*j+col);
    else couldBe = couldBe.replace(str,'');
  }

  // then do the same for each cell in the same 3x3 block
  for (var k=0; k<3; k++)
  for (var l=0; l<3; l++) {
    str = states[Nor+k][Wes+l];
    if (str == '') emptyInBox.push(9*(Nor+k)+Wes+l);
    else couldBe = couldBe.replace(str,'');
  }

  // set rowFixed to default if no other cells in the row can
  // have the removed value (if true, it's ok to remove)
  rowFixed = true;
  // then check each cell in the same row
  for (var m in emptyInRow)
    if (couldHave(emptyInRow[m],num)) rowFixed = false;
  // same for the column...
  colFixed = true;
  for (var m in emptyInCol)
    if (couldHave(emptyInCol[m],num)) colFixed = false;
  // ... and the 3x3 block
  boxFixed = true;
  for (var m in emptyInBox)
    if (couldHave(emptyInBox[m],num)) boxFixed = false;

  // finally, if the value in the cell can be deduced due to:
  if (/* ... no possible alternative values */ couldBe == '' ||
      /* ... only place in the row for that value */ rowFixed ||
      /* ... only place in the column for that value */ colFixed ||
      /* ... or only place in the 3x3 block for that value */ boxFixed) {
    // ... then delete it
    states[row][col] = '';
    $(grid[i]).text('');
    // remember to decrease number of remaining deletions allowed
    // while preserving input frequency for that value
    counts[encode[num]]--;
  }


  // ––––––––––––––––––––––––––––––––––––––––––––––––––
  // function to check if a given cell can have a given value
  // ––––––––––––––––––––––––––––––––––––––––––––––––––
  function couldHave( index , number ) {

    // secondary row & column variables (others in use in outer scope)
    _row = Math.floor(index/9);
    _col = index%9;

    // check other cells in the same row and column for clashes
    for (var j=0; j<9; j++) {
      if (9*_row+j != i && states[_row][j] == number) return false;
      if (9*j+_col != i && states[j][_col] == number) return false;
    }
    // then check other cells in the same 3x3 block
    Nor = 3*Math.floor(_row/3);
    Wes = 3*Math.floor(_col/3);
    for (var k=0; k<3; k++)
    for (var l=0; l<3; l++)
      if (9*(Nor+k)+Wes+l != i && states[Nor+k,Wes+l] == number) return false;

    // if there are no clashes:
    return true;
  }
}


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to brute-force check if a clue can be deleted
// (checks if the puzzle is still solvable after deletion)
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function bruteForceTryRemove( i ) {
  extraVal = $(grid[i]).text();

  // delete the value
  $(grid[i]).text('');
  // and only add it back if the puzzle is no longer soluble
  if (!solve(0)) $(grid[i]).text(extraVal);
}