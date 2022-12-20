import * as fs from 'fs'

let rawInput = fs.readFileSync('10-input.txt')
const input = rawInput.toString().split('\n').reverse()

// stage 1
let xRegister = 1
let currentCommand = input.pop()
let addingX = false

const computeCycle = (commands: string[]) => {
	if (currentCommand === 'noop') {
		// do nothing
	}
	if (currentCommand.startsWith('addx')) {
		if (!addingX) {
			addingX = true
      return
		} else {
			addingX = false
			xRegister += Number(currentCommand.split(' ')[1])
		}
	}
  currentCommand = commands.pop()
}

let signalStrength = 0;

for (let i = 1; i <= 220; i++) {
  if((i-20)%40 === 0) {
    signalStrength += (i * xRegister)
  }
	computeCycle(input)
}
console.log(signalStrength);

// stage 2

// reset
const input2 = rawInput.toString().split('\n').reverse()
console.log(input2.length);
xRegister = 1
currentCommand = input2.pop()
addingX = false


for (let y = 0; y < 6; y++) {
  let lineBuffer = Array(40).fill(".")
  for (let x = 0; x < 40 ; x++) {
    if(Math.abs(x - xRegister) < 2) {
      lineBuffer[x] = "#"
    }
    computeCycle(input2)
  }
  console.log(lineBuffer.join(" "));
}