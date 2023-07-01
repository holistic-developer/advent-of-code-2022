import { log } from 'console'

import * as fs from 'fs'

let rawInput = fs.readFileSync('12-input.txt').toString()
const lines = rawInput.split('\n')

const lineCount = lines.length
const lineLength = lines[0].length
const input = lines.map((line) => line.split(''))

type Step = {
	minDistance: number
	explored: boolean
	distanceFromStart: number
	previous?: Coordinates
}

type Coordinates = {
	x: number
	y: number
}

// stage 1
const singleLineInput = rawInput.replace(/\n/g, '')
const startIndex = singleLineInput.indexOf('S')
const SX = Math.floor(startIndex % lineLength)
const SY = Math.floor(startIndex / lineLength)

const endIndex = singleLineInput.indexOf('E')
const endX = Math.floor(endIndex % lineLength)
const endY = Math.floor(endIndex / lineLength)

function cityBlock(startX: number, startY: number, endX: number, endY: number): number {
	return Math.abs(endX - startX) + Math.abs(endY + startY)
}

function getBestUnexplored(steps: Map<string, Step>): string | null {
	var min = Number.MAX_VALUE
	var minDistanceStep: string | null = null
	steps.forEach((element, coordinates) => {
		if (element.minDistance + element.distanceFromStart < min && !element.explored) {
			min = element.minDistance + element.distanceFromStart
			minDistanceStep = coordinates
		}
	})
	return minDistanceStep
}

function getAllowedNeighbors(x: number, y: number, steps: Map<string, Step>): Coordinates[] {
	let neighbors: Coordinates[] = []
	// add candidates
	if (x > 0) neighbors.push({ x: x - 1, y })
	if (x < lineLength - 1) neighbors.push({ x: x + 1, y })
	if (y > 0) neighbors.push({ x, y: y - 1 })
	if (y < lineCount - 1) neighbors.push({ x, y: y + 1 })

	const currentHeight = input[y][x] === 'S' ? 97 : input[y][x].charCodeAt(0)
	neighbors = neighbors
		// filter by accessible height
		.filter(
			(neighbor) =>
				(input[neighbor.y][neighbor.x].charCodeAt(0) <= currentHeight + 1 &&
					input[neighbor.y][neighbor.x].charCodeAt(0) >= 97) ||
				(input[y][x] == 'z' && input[neighbor.y][neighbor.x] == 'E') ||
				(input[y][x] == 'y' && input[neighbor.y][neighbor.x] == 'E')
		)
		// filter already visiited
		.filter((neighbor) => !steps.has(`${neighbor.x}:${neighbor.y}`))

	return neighbors
}

function getShortestPathFrom(startX: number, startY: number): number {
	const steps: Map<string, Step> = new Map()
	steps.set(`${startX}:${startY}`, {
		minDistance: cityBlock(startX, startY, endX, endY),
		explored: false,
		distanceFromStart: 0,
	})

	let shortestPath = Number.MAX_VALUE
	while (getBestUnexplored(steps) != null) {
		const currentCoordinateString = getBestUnexplored(steps)
		const [cX, cY] = currentCoordinateString!.split(':').map(Number)
		const neighbors = getAllowedNeighbors(cX, cY, steps)
		const currentStep = steps.get(currentCoordinateString!)!
		neighbors.forEach((n) => {
			const newCoordniateString = `${n.x}:${n.y}`
			steps.set(newCoordniateString, {
				explored: false,
				previous: { x: cX, y: cY },
				distanceFromStart: currentStep.distanceFromStart + 1,
				minDistance: cityBlock(n.x, n.y, endX, endY),
			})
			if (input[n.y][n.x] == 'E') {
				shortestPath = steps.get(newCoordniateString)?.distanceFromStart!
			}
		})

		currentStep.explored = true
	}

	drawShortestPath(steps)
	return shortestPath
}

log(getShortestPathFrom(SX, SY))

// stage 2

const shortestPaths: number[] = []
singleLineInput.split('').forEach((element, index) => {
	if (element == 'S' || element == 'a') {
		const x = Math.floor(index % lineLength)
		const y = Math.floor(index / lineLength)
		shortestPaths.push(getShortestPathFrom(x, y))
	}
})

log(Math.min(...shortestPaths))

function drawShortestPath(steps: Map<string, Step>) {
	var currentStep = steps.get(`${endX}:${endY}`)!
	if (!currentStep) return
	const inputCopy = JSON.parse(JSON.stringify(input))
	while (currentStep.previous != null) {
		const previousStep = steps.get(`${currentStep.previous.x}:${currentStep.previous.y}`)!
		const x = currentStep.previous.x
		const y = currentStep.previous.y
		inputCopy[y][x] = `\x1b[47m${input[y][x]}\x1b[0m`
		currentStep = previousStep
	}
	console.clear()
	console.log(inputCopy.map((line) => line.join('')).join('\n'))
}
