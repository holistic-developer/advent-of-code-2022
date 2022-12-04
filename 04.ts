import * as fs from 'fs';

let rawInput = fs.readFileSync('04-input.txt');
const pairs = rawInput
  .toString()
  .split('\n');


// stage 1
function isContained(bigger: Number[], smaller: Number[]) {
  return bigger[0] <= smaller[0] && bigger[1] >= smaller[1];
}

const fullyConainted =
  pairs.map((pair) =>
    pair.split(',')
      .map((sections) => sections.split('-').map((v) => Number(v))))
      .filter(([first, second]) => isContained(first, second) || isContained(second, first))
    .length;

console.log(fullyConainted);

// stage 2
function isOverlapping(bigger: Number[], smaller: Number[]) {
  return bigger[0] <= smaller[1] && bigger[1] >= smaller[0];
}

const partiallyContained =
  pairs.map((pair) =>
    pair.split(',')
      .map((sections) => sections.split('-').map((v) => Number(v))))
    .filter(([first, second]) => isOverlapping(first, second) || isOverlapping(second, first))
    .length;

console.log(partiallyContained);