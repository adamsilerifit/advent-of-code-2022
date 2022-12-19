declare function require(name: string): any;

const fs = require('fs');
const path = require('path');

export const getChallengeInput = (__dirname: string, filename = 'input.txt'): string => {
  return fs.readFileSync(path.resolve(__dirname, filename), 'utf8');
};

export const test = (
  description: string,
  doScenario: () => void,
): void => {
  try {
    doScenario();
    console.log(`TEST PASSED: ${description}`);
  } catch (err) {
    console.log(`TEST FAILED: ${description}`);
    console.log((err as Error).message);
  }
};

export const assertEqual = (a: any, b: any) => {
  if (a !== b) {
    throw new Error(`${a} does not equal ${b}`);
  }
};

export const getDistinctValues = <T>(allValues: T[], valuesAreEqual: (a: T, b: T) => boolean = (a, b) => a === b): T[] => {
  return allValues
    .filter((a, i) => {
      return allValues.findIndex(b => valuesAreEqual(a, b)) === i;
    });
};
