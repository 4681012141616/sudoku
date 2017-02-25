var blockStr, rowStr, i3, a3, b3, temp, highlight;

function sortRows() {
  // sort 3-row blocks
  blockStr = '';
  for (var i in fullRowSequence) blockStr += i;

  if (blockStr == 'acb' || blockStr == 'ac')
    swapBlocks(1,2);
  else if (blockStr == 'bac' || blockStr == 'ba' || blockStr == 'b')
    swapBlocks(0,1);
  else if (blockStr == 'cba' || blockStr == 'cb' || blockStr == 'c')
    swapBlocks(0,2);
  else if (blockStr == 'bca' || blockStr == 'bc') {
    swapBlocks(0,1);
    swapBlocks(1,2);
  } else if (blockStr == 'cab' || blockStr == 'ca') {
    swapBlocks(2,0);
    swapBlocks(1,2);
  }

  // sort rows within blocks
  for (var i in fullRowSequence) {
    i3 = blockStr.indexOf(i)*3;
    rowStr = fullRowSequence[i].join('');

    if (rowStr == '021')
      swapRows(i3+1,i3+2);
    else if (rowStr == '102')
      swapRows(i3,i3+1);
    else if (rowStr == '210')
      swapRows(i3+2,i3);
    else if (rowStr == '120') {
      swapRows(i3,i3+1);
      swapRows(i3+1,i3+2);
    } else if (rowStr == '201') {
      swapRows(i3+2,i3+0);
      swapRows(i3+1,i3+2);
    }
  }

  drawFinalPuzzle();
}


function swapBlocks( a , b ) {
  a3 = a*3;
  b3 = b*3;
  for (var i=0; i<3; i++)
    swapRows(a3+i,b3+i);
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