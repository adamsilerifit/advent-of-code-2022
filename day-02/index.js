const fs = require('fs');
const path = require('path');

const symbols = {
  A: 'A',
  B: 'B',
  C: 'C',

  // these symbols map to different things in parts 1 and 2
  X: 'X',
  Y: 'Y',
  Z: 'Z',
};

const shapes = {
  ROCK:     'ROCK',
  PAPER:    'PAPER',
  SCISSORS: 'SCISSORS',
};

const outcomes = {
  WIN:  'WIN',
  LOSS: 'LOSS',
  DRAW: 'DRAW',
};

const symbolsToShapes = {
  [symbols.A]: shapes.ROCK,
  [symbols.B]: shapes.PAPER,
  [symbols.C]: shapes.SCISSORS,

  [symbols.X]: shapes.ROCK,
  [symbols.Y]: shapes.PAPER,
  [symbols.Z]: shapes.SCISSORS,
};

const symbolsToOutcomes = {
  [symbols.X]: outcomes.LOSS,
  [symbols.Y]: outcomes.DRAW,
  [symbols.Z]: outcomes.WIN,
};

const shapesToPoints = {
  [shapes.ROCK]:     1,
  [shapes.PAPER]:    2,
  [shapes.SCISSORS]: 3,
};

const outcomesToPoints = {
  [outcomes.WIN]:  6,
  [outcomes.DRAW]: 3,
  [outcomes.LOSS]: 0,
};

const rules = {
  [shapes.ROCK]: {
    defeats: shapes.SCISSORS,
    isDefeatedBy: shapes.PAPER,
  },
  [shapes.PAPER]: {
    defeats: shapes.ROCK,
    isDefeatedBy: shapes.SCISSORS,
  },
  [shapes.SCISSORS]: {
    defeats: shapes.PAPER,
    isDefeatedBy: shapes.ROCK,
  },
};

const inputStr = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const pairsOfSymbols = inputStr
  .split('\n')
  .map((pairOfSymbolsStr) => pairOfSymbolsStr.split(' '))

// part 1

const getOutcome = (theirShape, yourShape) => {
  if (rules[theirShape].isDefeatedBy === yourShape) {
    return outcomes.WIN;
  } else if (rules[theirShape].defeats === yourShape) {
    return outcomes.LOSS;
  } else {
    return outcomes.DRAW;
  }
}

const resultPart1 = pairsOfSymbols
  .map(([theirSymbol, yourSymbol]) => [symbolsToShapes[theirSymbol], symbolsToShapes[yourSymbol]])
  .map(([theirShape, yourShape]) => {
    const outcome = getOutcome(theirShape, yourShape);
    return outcomesToPoints[outcome] + shapesToPoints[yourShape];
  })
  .reduce((a, b) => a + b);

console.log(resultPart1);

// part 2

const getYourShape = (theirShape, desiredOutcome) => {
  switch (desiredOutcome) {
    case outcomes.WIN:
      return rules[theirShape].isDefeatedBy;

    case outcomes.LOSS:
      return rules[theirShape].defeats;

    case outcomes.DRAW:
      return theirShape;
  }
}

const resultPart2 = pairsOfSymbols
  .map(([theirShapeSymbol, desiredOutcomeSymbol]) => [symbolsToShapes[theirShapeSymbol], symbolsToOutcomes[desiredOutcomeSymbol]])
  .map(([theirShape, desiredOutcome]) => {
    const yourShape = getYourShape(theirShape, desiredOutcome);
    return outcomesToPoints[desiredOutcome] + shapesToPoints[yourShape];
  })
  .reduce((a, b) => a + b);

console.log(resultPart2);
