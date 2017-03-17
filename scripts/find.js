var numInput, rowStrings, row1, row2, row3, perms, bestPerm, labels = ['a','b','c'],
    remainingBlocks, tempInput, fullRowSequence, bestBlock, bestBlockMatches, matches;

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to search for the input message in row permutations
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function findInput() {
  // all letters will be converted to corresponding numbers (1-9)

  // store input to be found as a string of numbers
  numInput = '';
  for (var i in input) numInput += decode[input[i].toUpperCase()] || '';

  // store rows as strings of numbers
  rowStrings = [];
  for (var i=0; i<9; i++) rowStrings.push(states[i].join(''));

  // store 3x9 block rows still to be sorted
  remainingBlocks = [0,1,2];
  // as well as the optimally sorted rows so far
  fullRowSequence = {};

  // we will trim the input string (from its head) as we find
  // parts of it in the grid, so store a temporary copy
  tempInput = numInput;

  // loop until message is found or dead end is reached
  while (tempInput.length > 0) {

    // first go through each 3x9 block row looking for most matches
    bestBlock = [];
    bestBlockMatches = 0;

    for (var block in remainingBlocks) {
      block = 3*remainingBlocks[block];

      // go through strings representing the rows for current block
      rows = rowStrings.slice(block,block+3);
      perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
      bestPerm = [];
      bestPermMatches = 0;
      // check each permutation of these 3 rows for the most matches
      for (var perm in perms) {
        perm = perms[perm];
        str = '';
        for (var row in perm)
          str += rows[perm[row]];

        // (count matches for current permutation)
        matches = 0;
        while (str.indexOf(tempInput[matches]) >= 0)
          str = str.slice(str.indexOf(tempInput[matches++])+1);

        // (compare with previous best permutation)
        if (matches > bestPermMatches) {
          bestPermMatches = matches;
          bestPerm = perm;
        }
      }
      // check if no matches were found in any permutation
      if (bestPermMatches == 0) continue;

      // else check against previous best 3x9 block
      if (bestPermMatches > bestBlockMatches) {
        bestBlockMatches = bestPermMatches;
        bestBlock = [block/3,bestPerm];
        remainingBlocks.splice(remainingBlocks.indexOf(block/3),1);
      }
    }

    // if no 3x9 blocks produced any matches, abort search (dead end)
    if (bestBlock.length == 0) return false;
    // else trim head of (temporary) input string
    // and search for the rest in remainign 3x9 blocks
    fullRowSequence[labels[bestBlock[0]]] = bestBlock[1];
    tempInput = tempInput.slice(bestBlockMatches);
  }

  // having found the message, sort the blocks and rows accordingly
  sortRows();
  return true;
}