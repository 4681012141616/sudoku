var blockCount, rowIndex, tempRows, temp, highlight;

function sortRows() {

  // sort 3-row blocks
  blockCount = 0;
  for (var i in fullRowSequence) {
    if (i != blockCount) {
      swapBlocks(i,blockCount);

      tempRows = fullRowSequence[i];
      fullRowSequence[i] = fullRowSequence[blockCount] || [0,1,2];
      fullRowSequence[blockCount] = tempRows;
    }
    blockCount++;
  }

  // sort rows within blocks
  for (var i in fullRowSequence) {
    str = fullRowSequence[i].join('');

    if (str == '021')
      swapRows(3*i+1,3*i+2);
    else if (str == '102')
      swapRows(3*i,3*i+1);
    else if (str == '210')
      swapRows(3*i+2,3*i);
    else if (str == '120') {
      swapRows(3*i,3*i+1);
      swapRows(3*i+1,3*i+2);
    } else if (str == '201') {
      swapRows(3*i+2,3*i+0);
      swapRows(3*i+1,3*i+2);
    }
  }

  drawFinalPuzzle();
}


function swapBlocks( a , b ) {
  for (var i=0; i<3; i++)
    swapRows(3*a+i,3*b+i);
}


function swapRows( a , b ) {
  for (var j=0; j<9; j++) {
    temp = states[a][j];
    states[a][j] = states[b][j];
    states[b][j] = temp;
  }
}


function drawFinalPuzzle() {
  matches = 0;
  highlight = [];
  for (var i=0; i<9; i++)
  for (var j=0; j<9; j++) {
    $(grid[9*i+j]).text(encode[states[i][j]]);
    if (states[i][j] == numInput[matches]) {
      highlight.push(9*i+j);
      matches++;
    }
  }

  for (var i in highlight)
    $(grid[highlight[i]]).css('background','yellow');
}