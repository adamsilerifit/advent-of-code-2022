const fs = require('fs');
const path = require('path');

const getInput = () => {
  return fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
};

const parseRangeStr = (rangeStr) => {
  const [minStr, maxStr] = rangeStr.split('-');
  return {
    min: parseInt(minStr, 10),
    max: parseInt(maxStr, 10),
  };
};

const pairsOfRanges = getInput()
  .split('\n')
  .map(pairOfRangesStr => pairOfRangesStr.split(','))
  .map(([firstRangeStr, secondRangeStr]) => [
    parseRangeStr(firstRangeStr),
    parseRangeStr(secondRangeStr),
  ])

// part 1

const rangeAContainsRangeB = (rangeA, rangeB) => {
  return rangeA.min <= rangeB.min && rangeA.max >= rangeB.max;
};

const resultPart1 = pairsOfRanges
  .reduce((numBadRangePairs, [firstRange, secondRange]) => {
    if (rangeAContainsRangeB(firstRange, secondRange) || rangeAContainsRangeB(secondRange, firstRange)) {
      return numBadRangePairs + 1;
    } else {
      return numBadRangePairs;
    }
  }, 0);

console.log(resultPart1);

// part 2

const rangesOverlap = (rangeA, rangeB) => {
  const { min: a1, max: a2 } = rangeA;
  const { min: b1, max: b2 } = rangeB;

  // if range X starts to the left of range Y,
  // and the ranges are closer than the width of X,
  // the ranges must overlap

  return (a1 <= b1 && (b1 - a1) <= (a2 - a1)) ||
    (b1 <= a1 && (a1 - b1) <= (b2 - b1));
};

const resultPart2 = pairsOfRanges
  .reduce((numBadRangePairs, [firstRange, secondRange]) => {
    if (rangesOverlap(firstRange, secondRange)) {
      return numBadRangePairs + 1;
    } else {
      return numBadRangePairs;
    }
  }, 0);

console.log(resultPart2);
