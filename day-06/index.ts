const fs = require('fs');
const path = require('path');

export {};

const getInput = (): string => {
  return fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
};

const getDistinctCharacters = (str: string) => {
  return str
    .split('')
    .filter((char, index, str) => str.indexOf(char) === index)
    .join('');
};

const findEndOfFirstMarker = (signal: string, markerLength: number): number => {
  for (let i = markerLength - 1; i < signal.length; i++) {
    const signalPart = signal.slice(i + 1 - markerLength, i + 1);

    if (getDistinctCharacters(signalPart).length === markerLength) {
      return i + 1;
    }
  }

  return -1;
};

const doPart1 = () => {
  const signal = getInput();
  const startOfPacketMarkerLength = 4;
  console.log(findEndOfFirstMarker(signal, startOfPacketMarkerLength));
};

doPart1();

const doPart2 = () => {
  const signal = getInput();
  const startOfMessageMarkerLength = 14;
  console.log(findEndOfFirstMarker(signal, startOfMessageMarkerLength));
};

doPart2();
