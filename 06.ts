import * as fs from 'fs';

let rawInput = fs.readFileSync('06-input.txt');
const input = rawInput
  .toString();

// stage 1

function findFirstDistinctCharacters(input: string, lookback: number) {

  for (let i = lookback - 1; i < input.length; i++) {
    const potentialNewMarker = new Set()
    for (let l = 0; l < lookback; l++) {
      potentialNewMarker.add(input[i - l]);
    }
    if (potentialNewMarker.size === lookback) {
      return i + 1
    }
  }
  return undefined;
}

console.log(findFirstDistinctCharacters(input, 4));

// stage 2
console.log(findFirstDistinctCharacters(input, 14));