const fs = require('fs');
const path = require('path');

type Crate = string;
type Stack = Crate[];
type Stacks = Stack[];

type MoveInstruction = {
  numCrates: number;
  sourceStackNumber: number; // 1-based
  targetStackNumber: number; // 1-based
};

const getInput = () => {
  return fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
};

// [V]     [B]                     [C]
// [C]     [N] [G]         [W]     [P]
// [W]     [C] [Q] [S]     [C]     [M]
// [L]     [W] [B] [Z]     [F] [S] [V]
// [R]     [G] [H] [F] [P] [V] [M] [T]
// [M] [L] [R] [D] [L] [N] [P] [D] [W]
// [F] [Q] [S] [C] [G] [G] [Z] [P] [N]
// [Q] [D] [P] [L] [V] [D] [D] [C] [Z]
//  1   2   3   4   5   6   7   8   9

const createStacks = (): Stacks => {
  return [
    ['Q', 'F', 'M', 'R', 'L', 'W', 'C', 'V'],
    ['D', 'Q', 'L'],
    ['P', 'S', 'R', 'G', 'W', 'C', 'N', 'B'],
    ['L', 'C', 'D', 'H', 'B', 'Q', 'G'],
    ['V', 'G', 'L', 'F', 'Z', 'S'],
    ['D', 'G', 'N', 'P'],
    ['D', 'Z', 'P', 'V', 'F', 'C', 'W'],
    ['C', 'P', 'D', 'M', 'S'],
    ['Z', 'N', 'W', 'T', 'V', 'M', 'P', 'C'],
  ];
};

const parseMoveInstructionStr = (moveInstructionStr: string): MoveInstruction => {
  const pattern = /^move (\d+) from (\d+) to (\d+)/;
  const matches = pattern.exec(moveInstructionStr) as RegExpExecArray;

  return {
    numCrates: Number(matches[1]),
    sourceStackNumber: Number(matches[2]),
    targetStackNumber: Number(matches[3]),
  };
};

const moveCratesIndividually = (stacks: Stacks, { numCrates, sourceStackNumber, targetStackNumber }: MoveInstruction) => {
  for (let i = 0; i < numCrates; i++) {
    const crate = stacks[sourceStackNumber - 1].pop() as Crate;
    stacks[targetStackNumber - 1].push(crate);
  }
};

const moveCratesTogether = (stacks: Stacks, { numCrates, sourceStackNumber, targetStackNumber }: MoveInstruction) => {
  const stagedCrates: Crate[] = [];

  for (let i = 0; i < numCrates; i++) {
    const crate = stacks[sourceStackNumber - 1].pop() as Crate;
    stagedCrates.push(crate);
  }

  stagedCrates.reverse();
  stacks[targetStackNumber - 1].push(...stagedCrates);
};

const getTopCrates = (stacks: Stacks) => {
  return stacks.map(stack => stack[stack.length - 1]);
};

const doPart1 = () => {
  const stacks = createStacks();

  getInput()
    .split('\n')
    .map((moveInstructionStr: string) => parseMoveInstructionStr(moveInstructionStr))
    .forEach((moveInstruction: MoveInstruction) => moveCratesIndividually(stacks, moveInstruction));

  console.log(getTopCrates(stacks).join(''));
};

doPart1();

const doPart2 = () => {
  const stacks = createStacks();

  getInput()
    .split('\n')
    .map((moveInstructionStr: string) => parseMoveInstructionStr(moveInstructionStr))
    .forEach((moveInstruction: MoveInstruction) => moveCratesTogether(stacks, moveInstruction));

  console.log(getTopCrates(stacks).join(''));
};

doPart2();
