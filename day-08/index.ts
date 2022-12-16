import * as lib from '../lib';
declare const __dirname: string;

type HeightMap = number[][];

const getHeightMap = (): HeightMap => {
  return lib.getChallengeInput(__dirname)
    .split('\n')
    .map(row => row.split('').map(digitStr => Number(digitStr)));
};

const treeIsVisible = (heightMap: HeightMap, treeRowIndex: number, treeColumnIndex: number): boolean => {
  const westernMostIndex = 0;
  const easternMostIndex = heightMap[0].length - 1;
  const northernMostIndex = 0;
  const southernMostIndex = heightMap.length - 1;

  // west/east edges
  if (treeColumnIndex === westernMostIndex || treeColumnIndex === easternMostIndex) {
    return true;
  }

  if (treeRowIndex === northernMostIndex || treeRowIndex === southernMostIndex) {
    return true;
  }

  const treeHeight = heightMap[treeRowIndex][treeColumnIndex];

  const heightMapQueries = [
    () => heightMap[treeRowIndex].slice(0, treeColumnIndex), // get tree heights to the west
    () => heightMap[treeRowIndex].slice(treeColumnIndex + 1), // get tree heights to the east
    () => heightMap.map(row => row[treeColumnIndex]).slice(0, treeRowIndex), // get tree heights to the north
    () => heightMap.map(row => row[treeColumnIndex]).slice(treeRowIndex + 1), // get tree heights to the south
  ];

  for (const getTreeHeights of heightMapQueries) {
    if (Math.max(...getTreeHeights()) < treeHeight) {
      // tree is visible from one of the cardinal directions
      return true;
    }
  }

  return false;
};

const getScenicScore = (heightMap: HeightMap, treeRowIndex: number, treeColumnIndex: number): number => {
  const treeHeight = heightMap[treeRowIndex][treeColumnIndex];

  const heightMapQueries = [
    () => heightMap[treeRowIndex].slice(0, treeColumnIndex).reverse(), // get tree heights to the west
    () => heightMap[treeRowIndex].slice(treeColumnIndex + 1), // get tree heights to the east
    () => heightMap.map(row => row[treeColumnIndex]).slice(0, treeRowIndex).reverse(), // get tree heights to the north
    () => heightMap.map(row => row[treeColumnIndex]).slice(treeRowIndex + 1), // get tree heights to the south
  ];

  const viewingDistances: number[] = [];

  for (const getTreeHeightsAlongAxis of heightMapQueries) {
    const treeHeights = getTreeHeightsAlongAxis();
    const i = treeHeights.findIndex(otherTreeHeight => otherTreeHeight >= treeHeight);
    viewingDistances.push(i === -1 ? treeHeights.length : i + 1);
  }

  return viewingDistances
    .reduce((scenicScore, viewingDistance) => scenicScore * viewingDistance, 1);
};

const doTests = () => {
  {
    const testCases = [
      {
        description: 'west edge',
        heightMap: [
          [2, 2, 2],
          [1, 2, 2],
          [2, 2, 2],
        ],
        treeRowIndex: 1,
        treeColumnIndex: 0,
        expected: true,
      },
      {
        description: 'east edge',
        heightMap: [
          [2, 2, 2],
          [2, 2, 1],
          [2, 2, 2],
        ],
        treeRowIndex: 1,
        treeColumnIndex: 2,
        expected: true,
      },
      {
        description: 'north edge',
        heightMap: [
          [2, 1, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        treeRowIndex: 0,
        treeColumnIndex: 1,
        expected: true,
      },
      {
        description: 'south edge',
        heightMap: [
          [2, 2, 2],
          [2, 2, 2],
          [2, 1, 2],
        ],
        treeRowIndex: 2,
        treeColumnIndex: 1,
        expected: true,
      },
      {
        description: 'visible from west',
        heightMap: [
          [2, 2, 2],
          [1, 2, 2],
          [2, 2, 2],
        ],
        treeRowIndex: 1,
        treeColumnIndex: 1,
        expected: true,
      },
      {
        description: 'visible from east',
        heightMap: [
          [2, 2, 2],
          [2, 2, 1],
          [2, 2, 2],
        ],
        treeRowIndex: 1,
        treeColumnIndex: 1,
        expected: true,
      },
      {
        description: 'visible from north',
        heightMap: [
          [2, 1, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        treeRowIndex: 1,
        treeColumnIndex: 1,
        expected: true,
      },
      {
        description: 'visible from south',
        heightMap: [
          [2, 2, 2],
          [2, 2, 2],
          [2, 1, 2],
        ],
        treeRowIndex: 1,
        treeColumnIndex: 1,
        expected: true,
      },
      {
        description: 'not visible',
        heightMap: [
          [2, 2, 2],
          [2, 1, 2],
          [2, 2, 2],
        ],
        treeRowIndex: 1,
        treeColumnIndex: 1,
        expected: false,
      },
      {
        description: 'barely not visible',
        heightMap: [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        treeRowIndex: 1,
        treeColumnIndex: 1,
        expected: false,
      },
    ];

    for (const testCase of testCases) {
      lib.test(`treeIsVisible ${testCase.description}`, () => {
        const actual = treeIsVisible(testCase.heightMap, testCase.treeRowIndex, testCase.treeColumnIndex);
        lib.assertEqual(actual, testCase.expected);
      });
    }
  }

  const testCases = [
    {
      description: 'lone tree',
      heightMap: [
        [1],
      ],
      treeRowIndex: 0,
      treeColumnIndex: 0,
      expectedScenicScore: 0,
    },
    {
      description: 'tree surrounded by shorter trees',
      heightMap: [
        [1, 1, 1],
        [1, 2, 1],
        [1, 1, 1],
      ],
      treeRowIndex: 1,
      treeColumnIndex: 1,
      expectedScenicScore: 1,
    },
    {
      description: 'tree surrounded by shorter trees (2)',
      heightMap: [
        [1, 1, 1, 1],
        [1, 2, 1, 1],
        [1, 1, 1, 1],
      ],
      treeRowIndex: 1,
      treeColumnIndex: 1,
      expectedScenicScore: 2,
    },
    {
      description: 'tree surrounded by taller and shorter trees',
      heightMap: [
        [3, 3, 3, 3, 1],
        [3, 2, 1, 3, 1],
        [3, 3, 1, 3, 1],
      ],
      treeRowIndex: 1,
      treeColumnIndex: 1,
      expectedScenicScore: 2,
    },
  ];

  for (const testCase of testCases) {
    lib.test(`getScenicScore ${testCase.description}`, () => {
      const actual = getScenicScore(testCase.heightMap, testCase.treeRowIndex, testCase.treeColumnIndex);
      lib.assertEqual(actual, testCase.expectedScenicScore);
    });
  }
};

// doTests();

const traverseHeightMap = (heightMap: HeightMap, visit: (rowIndex: number, columnIndex: number) => void): void => {
  for (let rowIndex = 0; rowIndex < heightMap.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < heightMap[0].length; columnIndex++) {
      visit(rowIndex, columnIndex);
    }
  }
};

const doPart1 = () => {
  const heightMap = getHeightMap();
  let numTreesVisible = 0;

  traverseHeightMap(heightMap, (rowIndex, columnIndex) => {
    if (treeIsVisible(heightMap, rowIndex, columnIndex)) {
      numTreesVisible++;
    }
  });

  console.log(`Num trees visible: ${numTreesVisible}`);
};

doPart1();

const doPart2 = () => {
  const heightMap = getHeightMap();
  const scenicScores: number[] = [];

  traverseHeightMap(heightMap, (rowIndex, columnIndex) => {
    scenicScores.push(getScenicScore(heightMap, rowIndex, columnIndex));
  });

  console.log(`Max scenic score: ${Math.max(...scenicScores)}`);
};

doPart2();
