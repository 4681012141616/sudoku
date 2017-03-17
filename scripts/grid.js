var tableHTML, index, grid;

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// generate the HTML for the sudoku grid on load
// ––––––––––––––––––––––––––––––––––––––––––––––––––
$(function(){
  tableHTML = "<table id='grid'>";

  // iterate through 3x3 blocks
  for (var row=0; row<3; row++) {
    tableHTML += '<tr>';
  for (var col=0; col<3; col++) {
    tableHTML += '<td><table>';

    // iterate through 1x1 cells within each block
    for (var blockRow=0; blockRow<3; blockRow++) {
    tableHTML += '<tr>';
    for (var blockCol=0; blockCol<3; blockCol++) {
      index = blockCol + 3*col + 9*blockRow + 27*row;
      tableHTML += "<td><div id='box" + index + "' class='box' contenteditable></div></td>";
    }
      tableHTML += '</tr>';
    }

    tableHTML += '</table></td>';
  }
    tableHTML += '</tr>';
  }

  tableHTML += '</table>';

  // write the grid HTML to the webpage
  $('#grid-container').html(tableHTML);

  // store the 1x1 grid squares in a row-sorted array
  grid = $('#grid div').sort(function(a,b){
    return a.id.replace('box','') - b.id.replace('box','');
  });

  // colour the 3x3 blocks' backgrounds
  colourCells();
});


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// draw the red- and blue-ish square backgrounds
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function colourCells() {
  for (var i=0; i<81; i++)
    // cells are ordered in 3x3 squares
    // mapping is needed to convert to ordering by row
    $(grid[i]).css('background',(_((i%9)/3+_(i/27))%2)?'#FEE':'#F8F8FF');
}
// compact floor function
function _(x) { return Math.floor(x); }


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// clear all letters from the sudoku grid
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function clearGrid() {
  for (var i=0; i<81; i++) $(grid[i]).text('');
}