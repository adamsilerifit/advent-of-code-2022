const fs = require('fs');
const path = require('path');

const inputStr = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const endOfLinePattern = '\n'
const blankLinePattern = '\n\n';

const caloriesPerElf = inputStr
  .split(blankLinePattern)
  .map(calorieGroupStr => calorieGroupStr
    .split(endOfLinePattern)
    .reduce((a, b) => a + parseInt(b, 10), 0));

const caloriesPerElfDesc = [...caloriesPerElf].sort((a, b) => b - a);

// part 1
console.log(caloriesPerElfDesc[0]);

// part 2
console.log(caloriesPerElfDesc[0] + caloriesPerElfDesc[1] + caloriesPerElfDesc[2])
