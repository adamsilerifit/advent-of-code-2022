import * as lib from '../lib';
declare const __dirname: string;

type Position = {
  x: number;
  y: number;
}

type Rope = Position[];
type Move = {
  direction: 'R' | 'L' | 'U' | 'D';
  distance: number;
};

const applyStep = (rope: Rope, moveDirection: string): void => {
  switch (moveDirection) {
    case 'R':
      rope[0].x++;
      break;
    case 'L':
      rope[0].x--;
      break;
    case 'U':
      rope[0].y++;
      break;
    case 'D':
      rope[0].y--;
      break;
  }

  for (let j = 0; (j + 1) < rope.length; j++) {
    updateNextKnotPosition(rope[j], rope[j + 1]);
  }
};

const updateNextKnotPosition = (referenceKnotPosition: Position, nextKnotPosition: Position): void => {
  const xDistance = referenceKnotPosition.x - nextKnotPosition.x;
  const yDistance = referenceKnotPosition.y - nextKnotPosition.y;

  if (Math.abs(xDistance) > 1 && Math.abs(yDistance) > 1) {
    nextKnotPosition.x = referenceKnotPosition.x - Math.sign(xDistance);
    nextKnotPosition.y = referenceKnotPosition.y - Math.sign(yDistance);
  } else if (Math.abs(xDistance) > 1) {
    nextKnotPosition.x = referenceKnotPosition.x - Math.sign(xDistance);
    nextKnotPosition.y = referenceKnotPosition.y;
  } else if (Math.abs(yDistance) > 1) {
    nextKnotPosition.x = referenceKnotPosition.x;
    nextKnotPosition.y = referenceKnotPosition.y - Math.sign(yDistance);
  }
};

const positionsAreEqual = (p1: Position, p2: Position): boolean => {
  return p1.x === p2.x && p1.y === p2.y;
};

const getTailPositions = (rope: Rope): Position[] => {
  const tailPositions = [
    { ...rope[rope.length - 1] },
  ];

  lib.getChallengeInput(__dirname)
    .split('\n')
    .map(moveStr => moveStr.split(' '))
    .map(([direction, distanceStr]) => ({ direction, distance: Number(distanceStr) }))
    .forEach(move => {
      for (let i = 0; i < move.distance; i++) {
        applyStep(rope, move.direction);
        tailPositions.push({ ...rope[rope.length - 1] });
      }
    });

  return tailPositions;
};

const doPart1 = () => {
  const numKnots = 2;
  const rope: Rope = new Array(numKnots).fill(null).map(knot => ({ x: 0, y: 0 }));

  const tailPositions = getTailPositions(rope);

  console.log(`Num tail positions: ${tailPositions.length}`);
  console.log(`Num distinct tail positions: ${lib.getDistinctValues(tailPositions, positionsAreEqual).length}`);
};

doPart1();

const doPart2 = () => {
  const numKnots = 10;
  const rope: Rope = new Array(numKnots).fill(null).map(knot => ({ x: 0, y: 0 }));

  const tailPositions = getTailPositions(rope);

  console.log(`Num tail positions: ${tailPositions.length}`);
  console.log(`Num distinct tail positions: ${lib.getDistinctValues(tailPositions, positionsAreEqual).length}`); // 2405 is too low
};

doPart2();

const visuallyDebugRopeAlgorithm = () => {
  type GridView = string[][];

  const numKnots = 10;
  const rope: Rope = new Array(numKnots).fill(null).map(knot => ({ x: 0, y: 0 }));

  const moves: Move[] = [
    { direction: 'R', distance: 4 },
    { direction: 'U', distance: 4 },
    { direction: 'L', distance: 3 },
    { direction: 'D', distance: 1 },
    { direction: 'R', distance: 4 },
    { direction: 'D', distance: 1 },
    { direction: 'L', distance: 5 },
    { direction: 'R', distance: 2 },
  ];

  const createEmptyGridView = (viewWidth: number, viewHeight: number): GridView => {
    return new Array(viewHeight).fill(null).map(row => new Array(viewWidth).fill('.'));
  };

  const getKnotSymbol = (rope: Rope, knotIndex: number): string => {
    if (knotIndex === 0) {
      return 'H';
    }

    if (knotIndex === rope.length - 1) {
      return 'T';
    }

    return String(knotIndex);
  };

  // assumes rope fits in view
  const addRopeToGridView = (gridView: GridView, rope: Rope): void => {
    for (let knotIndex = rope.length - 1; knotIndex >= 0; knotIndex--) {
      const { x, y } = rope[knotIndex];
      gridView[y][x] = getKnotSymbol(rope, knotIndex);
    }
  };

  const drawGridView = (gridView: GridView) => {
    // flip y-axis when drawing; 0,0 should be in the BOTTOM left corner
    for (const row of [...gridView].reverse()) {
      console.log(row.join(''));
    }
  };

  const drawStep = () => {
    const viewWidth = 6;
    const viewHeight = 5;

    const gridView = createEmptyGridView(viewWidth, viewHeight);
    addRopeToGridView(gridView, rope);
    drawGridView(gridView);

    console.log('');
  };

  drawStep();
  moves.forEach(move => {
    for (let i = 0; i < move.distance; i++) {
      applyStep(rope, move.direction);
      drawStep();
    }
  });
};

// visuallyDebugRopeAlgorithm();
