import * as fs from 'fs'

let rawInput = fs.readFileSync('09-input.txt')
const input = rawInput
	.toString()
	.split('\n')
	.map((line) => line.split(' '))

// stage 1
const expandedSteps = input.map(([direction, count]) => new Array(Number(count)).fill(direction)).flat()

type Position = {
	x: number
	y: number
}

let head: Position = { x: 0, y: 0 }
let tail: Position = { x: 0, y: 0 }

const tailPositions = new Set<string>()

function recordTailPosition(p: Position): void {
	tailPositions.add(`${p.x}:${p.y}`)
}

function setNewHeadPosition(head: Position, step: 'U' | 'D' | 'L' | 'R'): void {
	switch (step) {
		case 'U':
			head.y++
			break
		case 'D':
			head.y--
			break
		case 'R':
			head.x++
			break
		case 'L':
			head.x--
			break
		default:
			console.error('Unknown direction')
	}
}

recordTailPosition(tail)

// stage 2
const setNextKnotPosition = (head: Position, tail: Position): void => {
	// T to left of H
  if (head.x - tail.x > 1) {
		tail.x++
		if (head.y > tail.y) {
			tail.y++
		} else if (head.y < tail.y) {
			tail.y--
		}
	}
	// T to right of H
	if (head.x - tail.x < -1) {
		tail.x--
		if (head.y > tail.y) {
			tail.y++
		} else if (head.y < tail.y) {
			tail.y--
		}
	}
	// T above of H
	if (head.y - tail.y < -1) {
		tail.y--
		if (head.x > tail.x) {
			tail.x++
		} else if (head.x < tail.x) {
			tail.x--
		}
	}
	// T below of H
	if (head.y - tail.y > 1) {
		tail.y++
		if (head.x > tail.x) {
			tail.x++
		} else if (head.x < tail.x) {
			tail.x--
		}
	}
}

for (const step of expandedSteps) {
	setNewHeadPosition(head, step)
	setNextKnotPosition(head, tail)
	recordTailPosition(tail)
}

console.log(tailPositions.size)

// stage 2
tailPositions.clear()

const rope = Array<Position>(10).fill(undefined).map(() => ({x: 0, y: 0}))

recordTailPosition(rope[9])

for (const step of expandedSteps) {
	setNewHeadPosition(rope[0], step)
	for (let i = 0; i < rope.length - 1; i++) {
		setNextKnotPosition(rope[i], rope[i + 1])
	}
	recordTailPosition(rope[rope.length - 1])
}
console.log(tailPositions.size)
	printRope(rope)


function printRope(rope: Position[]) {
	const minx = Math.min(...rope.map((p) => p.x))
	const maxx = Math.max(...rope.map((p) => p.x))
	const miny = Math.min(...rope.map((p) => p.y))
	const maxy = Math.max(...rope.map((p) => p.y))
	const xsize = maxx - minx + 1
	const ysize = maxy - miny + 1

	const field = new Array(ysize).fill('').map(() => new Array<string>(xsize).fill('.'))
	for (let i = rope.length - 1; i >= 0; i--) {
		field[rope[i].y - miny][rope[i].x - minx] = i.toString()
	}
	for (let y = ysize - 1; y >= 0; y--) {
		console.log(field[y].join(' '))
	}
}
