import * as fs from 'fs';

let rawInput = fs.readFileSync('03-input.txt');
const backpacks = rawInput
  .toString()
  .split('\n').map((line) => line.split(''));


//stage 1
function findDuplicateItem(content: string[]): string {
  const leftCompartment = content.slice(0, content.length / 2)
  const rightCompartment = content.slice(content.length / 2, content.length)
  return leftCompartment.find(value => rightCompartment.find((i) => i === value));
}

function getPriority(item: string): number {
  const isUpperCase = item.match(/[A-Z]/);
  const priority = item.toLowerCase().charCodeAt(0) - "a".charCodeAt(0) + 1
  return isUpperCase ? priority + 26 : priority;
}

const prioritiesSum = backpacks
  .map(findDuplicateItem)
  .map(getPriority)
  .reduce((a,b) =>  a + b);

console.log(prioritiesSum);

//stage 2
let totalSum = 0;
for(let backpackIndex = 0; backpackIndex <= backpacks.length -1; backpackIndex += 3) {
  const commonItem = backpacks[backpackIndex].find((item) => backpacks[backpackIndex + 1].find(i => i === item) && backpacks[backpackIndex + 2].find(i => i === item))
  totalSum += getPriority(commonItem);
}

console.log(totalSum)