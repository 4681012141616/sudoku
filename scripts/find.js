var numInput, rowStrings, row1, row2, row3, perms, bestPerm,
    remainingBlocks, tempInput, fullRowSequence, bestBlock, bestBlockMatches, matches;

function findInput() {
  numInput = '';
  fullRowSequence = {};
  rowStrings = [];
  for (var i=0; i<9; i++) rowStrings.push(states[i].join(''));
  for (var i in input) numInput += decode[input[i].toUpperCase()] || '';
  remainingBlocks = [0,1,2];

  tempInput = numInput;
  while (tempInput.length > 0) {
    bestBlock = [];
    bestBlockMatches = 0;

    for (var block in remainingBlocks) {
      block = 3*remainingBlocks[block];

      rows = rowStrings.slice(block,block+3);
      perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
      bestPerm = [];
      bestPermMatches = 0;
      for (var perm in perms) {
        perm = perms[perm];
        str = '';
        for (var row in perm)
          str += rows[perm[row]];

        matches = 0;
        while (str.indexOf(tempInput[matches]) >= 0)
          str = str.slice(str.indexOf(tempInput[matches++])+1);

        if (matches > bestPermMatches) {
          bestPermMatches = matches;
          bestPerm = perm;
        }
      }
      if (bestPermMatches == 0) return false;

      if (bestPermMatches > bestBlockMatches) {
        bestBlockMatches = bestPermMatches;
        bestBlock = [block/3,bestPerm];
        remainingBlocks.splice(remainingBlocks.indexOf(block/3),1);
      }
    }
    if (bestBlock.length == 0) return false;
    fullRowSequence[bestBlock[0]] = bestBlock[1];
    tempInput = tempInput.slice(bestBlockMatches);
  }

  sortRows();
  return true;
}