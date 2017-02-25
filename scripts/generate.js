var attempts, emptyInRow, emptyInCol, emptyInBox, rowFixed, colFixed, boxFixed,
    Nor, Wes, couldBe, indices = [], index;


$('#generate').click(function(){
  colourCells();
  if (!parseInput()) return;
  attempts = 0; generate();
});

function generate() {
  clearGrid();
  refreshCounts();
  states = [[1,2,3,4,5,6,7,8,9],[7,8,9,1,2,3,4,5,6],[4,5,6,7,8,9,1,2,3],
            [9,1,2,3,4,5,6,7,8],[6,7,8,9,1,2,3,4,5],[3,4,5,6,7,8,9,1,2],
            [8,9,1,2,3,4,5,6,7],[5,6,7,8,9,1,2,3,4],[2,3,4,5,6,7,8,9,1]];
  for (var i=0; i<81; i++) indices.push(i);
  for (var i=0; i<81; i++) {
    index = Math.floor(Math.random()*(81-i));
    tryRemove(indices[index]);
    indices.splice(index,1);
  }
  if (!findInput() && ++attempts < 1000) generate();
  else if (attempts == 1000) alert('Haven\'t found one in 1000 trials, but you can keep trying');
}


function tryRemove( i ) {
  emptyInRow = [];
  emptyInCol = [];
  emptyInBox = [];
  row = Math.floor(i/9);
  col = i%9;
  num = states[row][col];
  if (counts[encode[num]] == 0) return;

  Nor = 3*Math.floor(row/3);
  Wes = 3*Math.floor(col/3);

  couldBe = '123456789';

  for (var j=0; j<9; j++) {
    str = states[row][j];
    if (str == '') emptyInRow.push(9*row+j);
    else couldBe = couldBe.replace(str,'');

    str = states[j][col];
    if (str == '') emptyInCol.push(9*j+col);
    else couldBe = couldBe.replace(str,'');
  }

  for (var k=0; k<3; k++)
    for (var l=0; l<3; l++) {
      str = states[Nor+k][Wes+l];
      if (str == '') emptyInBox.push(9*(Nor+k)+Wes+l);
      else couldBe = couldBe.replace(str,'');
    }

  rowFixed = true;
  for (var m in emptyInRow)
    if (couldHave(emptyInRow[m],num)) rowFixed = false;
  colFixed = true;
  for (var m in emptyInCol)
    if (couldHave(emptyInCol[m],num)) colFixed = false;
  boxFixed = true;
  for (var m in emptyInBox)
    if (couldHave(emptyInBox[m],num)) boxFixed = false;

  if (couldBe == '' || rowFixed || colFixed || boxFixed) {
    states[row][col] = '';
    $(grid[i]).text('');
    counts[encode[num]]--;
  }


  function couldHave( index , number ) {
    _row = Math.floor(index/9);
    _col = index%9;

    for (var j=0; j<9; j++) {
      if (9*_row+j != i && states[_row][j] == number) return false;
      if (9*j+_col != i && states[j][_col] == number) return false;
    }
    Nor = 3*Math.floor(_row/3);
    Wes = 3*Math.floor(_col/3);
    for (var k=0; k<3; k++)
    for (var l=0; l<3; l++)
      if (9*(Nor+k)+Wes+l != i && states[Nor+k,Wes+l] == number) return false;

    return true;
  }
}