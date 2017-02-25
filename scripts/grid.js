var tableHTML, index, grid, shifted = false, alted = false;

$(function(){
  alert('Update: now displays the input sentence in readable order');
  tableHTML = "<table id='grid'>";
  for (var row=0; row<3; row++) {
    tableHTML += '<tr>';
    for (var col=0; col<3; col++) {
      tableHTML += '<td><table>';
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

  $('#grid-container').html(tableHTML);

  grid = $('#grid div').sort(function(a,b){
    return a.id.replace('box','') - b.id.replace('box','');
  });

  colourCells();
});

function colourCells() {
  for (var i=0; i<81; i++)
    $(grid[i]).css('background',(_((i%9)/3+_(i/27))%2)?'#FEE':'#F8F8FF');
}

function clearGrid() {
  for (var i=0; i<81; i++) $(grid[i]).text('');
}

function _(x) { return Math.floor(x); }