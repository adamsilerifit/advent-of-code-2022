const fs = require('fs');
const path = require('path');

const getItemTypePriority = (itemType) => {
  const itemTypes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return itemTypes.indexOf(itemType) + 1; // 1..52
};

const inputStr = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

// part 1

const resultPart1 = inputStr
  .split('\n')
  .map(rucksackInventory => {
    const compartmentBoundary = Math.ceil(rucksackInventory.length / 2);
    return [rucksackInventory.slice(0, compartmentBoundary), rucksackInventory.slice(compartmentBoundary)];
  })
  .map(([firstCompartmentInventory, secondCompartmentInventory]) => {
    const crossFiledItemTypes = [];

    for (const itemType of firstCompartmentInventory) {
      if (secondCompartmentInventory.includes(itemType)) {
        crossFiledItemTypes.push(itemType);
      }
    }

    return crossFiledItemTypes;
  })
  // filter duplicates
  .map(crossFiledItemTypes => [...new Set(crossFiledItemTypes)])
  .map(itemType => getItemTypePriority(itemType))
  .reduce((sumOfPriorities, priority) => sumOfPriorities + priority, 0);

console.log(resultPart1);

// part 2

const resultPart2 = inputStr
  .split('\n')
  // combine rucksack inventories into groups of `groupSize`
  .reduce((rucksackInventoriesByGroup, rucksackInventoryStr, rucksackInventoryIndex) => {
    const groupSize = 3;
    const groupIndex = Math.floor(rucksackInventoryIndex / groupSize);

    if (!rucksackInventoriesByGroup[groupIndex]) {
      rucksackInventoriesByGroup[groupIndex] = [];
    }

    rucksackInventoriesByGroup[groupIndex].push(rucksackInventoryStr);

    return rucksackInventoriesByGroup;
  }, [])
  // find item types common to all inventories in a group
  .map(groupOfRucksackInventories => {
    const firstRucksackInventory = groupOfRucksackInventories[0];
    const subsequentRucksackInventories = groupOfRucksackInventories.slice(1);
    const commonItemTypes = [];

    for (const itemType of firstRucksackInventory) {
      if (subsequentRucksackInventories.every(inventory => inventory.includes(itemType))) {
        commonItemTypes.push(itemType);
      }
    }

    return commonItemTypes;
  })
  // filter duplicates
  .map(commonItemTypes => [...new Set(commonItemTypes)])
  .map(itemType => getItemTypePriority(itemType))
  .reduce((sumOfPriorities, priority) => sumOfPriorities + priority, 0);

console.log(resultPart2);
