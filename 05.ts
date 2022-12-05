import * as fs from 'fs';

let rawInput = fs.readFileSync('05-input.txt');
const input = rawInput
  .toString()
  .split('\n\n');

function parseInput(initialState: string): string[][] {
  const lines = initialState.split('\n');
  const stacksCount = Math.max(
    ...lines[lines.length - 1].split(/\W+/).map((v) => Number(v))
  );

  const stacks : string[][] = Array<string[]>(stacksCount);
  for (let i = 0; i < stacks.length; i++) {
    stacks[i]= new Array<string>();
  }

  for (let y = lines.length - 2; y >= 0; y--) {
    const line = lines[y].split('');
    for (let x = 1; x < line.length; x += 4) {
      const crate = line[x];
      if (crate != ' ') {
        stacks[Math.ceil(x / 4)-1].push(crate);
      }
    }
  }
  return stacks;
}

// stage 1
const initialState = input[0];
const rearrangements = input[1].split('\n');

let stacks = parseInput(initialState);

rearrangements.forEach(command => {
  const [_, quantity, __, start, ___, target] = command.split(' ').map(Number);
  for (let i = 0; i < quantity; i++) {
    stacks[target-1].push(stacks[start -1].pop())
  }
})

console.log(stacks.map(value => value.pop()).join(''));


// stage 2
stacks = parseInput(initialState);

rearrangements.forEach(command => {
  const [_, quantity, __, start, ___, target] = command.split(' ').map(Number);
  const craneStack = [];
  for (let i = 0; i < quantity; i++) {
    craneStack.push(stacks[start -1].pop())
  }
  for (let i = 0; i < quantity; i++) {
    stacks[target - 1].push(craneStack.pop());
  }
})

console.log(stacks.map(value => value.pop()).join(''));
