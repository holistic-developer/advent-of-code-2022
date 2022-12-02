import * as fs from 'fs';

let rawInput = fs.readFileSync('01-input.txt');
const input = rawInput
  .toString()
  .split('\n\n')
  .map((elf) => elf.split('\n')
    .map((value) => parseInt(value))
    .reduce((a, b) => a + b));

// stage 1
console.log(Math.max(...input));


// stage 2
const top3 = input.sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((a, b) => a + b);
console.log(top3);