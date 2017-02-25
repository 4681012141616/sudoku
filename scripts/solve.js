var states = [], num, row, col, changed;
for(var i=0; i<9; i++) states[i] = new Array(9);

$('#simplify').click(function(){
  for(var i in states) states[i].fill('123456789');
  changed = [];

  grid.each(function(i){
    num = decode[$(this).text()] || '';
    if (num != '') {
      states[Math.floor(i/9)][i%9] = num;
      changed.push(i);
    }
  });

  for (var i in changed) {
    i = changed[i];
    row = Math.floor(i/9);
    col = i%9;
    num = states[row][col];
    Nor = 3*Math.floor(row/3);
    Wes = 3*Math.floor(col/3);


    for (var j=0; j<9; j++) {

      if (j != col) {
        if (states[row][j] == num) {
          alert('No solution');
          return;
        }
        else {
          str = states[row][j].replace(num,'');
          states[row][j] = str;
          if (str.length == 1) {
            index = 9*row+j;
            $(grid[index]).text(encode[str]);
          }
        }
      }
      if (j != row) {
        if (states[j][col] == num) {
          alert('No solution');
          return;
        }
        else {
          str = states[j][col].replace(num,'');
          states[j][col] = str;
          if (str.length == 1) {
            index = 9*j+col;
            $(grid[index]).text(encode[str]);
          }
        }
      }
    }

    for (var k=0; k<3; k++)
    for (var l=0; l<3; l++) {

      if (Nor+k != row || Wes+l != col) {
        if (states[Nor+k][Wes+l] == num) {
          alert('No solution');
          return;
        }
        else {  
          str = states[Nor+k][Wes+l].replace(num,'');
          states[Nor+k][Wes+l] = str;
          if (str.length == 1) {
            index = 9*(Nor+k)+Wes+l;
            $(grid[index]).text(encode[str]);
          }
        }
      }
    }
  }
});