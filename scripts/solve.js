var states = [], num, row, col, changed, newChanged;
for(var i=0; i<9; i++) states[i] = new Array(9);

// event listener to fill in some 1-step cells
$('#simplify').click(function(){ solve(1); });


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to solve the puzzle (and check for solubility)
// optional parameter: 0 for Boolean check, 1 to simplify
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function solve( n ) {

  // at each iteration, keep track of cells whose
  // contents have been filled in (i.e. a new "clue")
  changed = [];

  // get state of grid from HTML
  for(var i in states) states[i].fill('123456789');

  grid.each(function(i){
    num = decode[$(this).text()] || '';
    if (num != '') {
      states[Math.floor(i/9)][i%9] = num;
      changed.push(i);
    }
  });

  // loop until dead end, contradiction, or puzzle is solved
  while (changed.length > 0) {

    // need to loop through previous new clues, so
    // store those from this iteration in new array
    newChanged = [];

    // iterate through new clues from previous iteration
    for (var i in changed) {
      // store index
      i = changed[i];
      // ... row & column
      row = Math.floor(i/9);
      col = i%9;
      // ... clue that has been filled in
      num = states[row][col];
      // ... and index of top-left cell in 3x3 block
      Nor = 3*Math.floor(row/3);
      Wes = 3*Math.floor(col/3);


      // use variable j for row and then column indices
      for (var j=0; j<9; j++) {

        // first go through each cell in the same row
        if (j != col) /* (exclude the new clue itself) */ {
          // contradiction if number appears twice in the row
          if (states[row][j] == num) {
            noSolution();
            return false;
          }
          // otherwise remove new clue from cell's possible values
          else {
            str = states[row][j].replace(num,'');
            // check if we can fill in another cell
            if (str.length == 1 && states[row][j].length > 1)
              // if so, record cell index for next iteration
              newChanged.push(9*row+j);
            states[row][j] = str;
          }
        }

        // then do the same for each cell in the same column
        if (j != row) {
          if (states[j][col] == num) {
            noSolution();
            return false;
          } else {
            str = states[j][col].replace(num,'');
            if (str.length == 1 && states[j][col].length > 1)
              newChanged.push(9*j+col);
            states[j][col] = str;
          }
        }
      }

      // finally, check each cell in the same 3x3 block
      for (var k=0; k<3; k++)
      for (var l=0; l<3; l++) {
        if (Nor+k != row || Wes+l != col) {
          if (states[Nor+k][Wes+l] == num) {
            noSolution();
            return false;
          } else {  
            str = states[Nor+k][Wes+l].replace(num,'');
            if (str.length == 1 && states[Nor+k][Wes+l].length > 1)
              newChanged.push(9*(Nor+k)+Wes+l);
            states[Nor+k][Wes+l] = str;
          }
        }
      }
    }
    // if optional input 1, just do one iteration
    if (n == 1) break;
    changed = newChanged;
  }
  // finished puzzle-solving loop

  // now check puzzle for solved state:
  // set solvable to default value if all cells filled
  solvable = true;
  // loop through every cell, checking for completeness
  for (var i=0; i<9; i++)
  for (var j=0; j<9; j++) {
    index = 9*i+j;
    str = states[i][j];
    // if any cell is not filled, puzzle is insoluble
    if (str.length != 1) 
      solvable = false;
    // if optional input 0, don't change grid HTML
    else if (n != 0)
      $(grid[index]).text(encode[str]);
  }
  return solvable;
}