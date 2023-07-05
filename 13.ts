import { log } from 'console'

import * as fs from 'fs'

let rawInput = fs.readFileSync('13-input.txt').toString()
const packetPairs = rawInput.split('\n\n')

// stage 1

let sumOfIndex = 0
packetPairs
	.map((pair) => {
		const [left, right] = pair.split('\n')

		return validateOrder(left, right)
	})
	.forEach((valid, index) => {
		if (valid) {
			sumOfIndex += index + 1
		}
	})
log(sumOfIndex)

function validateOrder(rawLeft: string, rawRight: string): boolean | undefined {
	log(`comparing '${rawLeft}' to '${rawRight}'`)
	const left = eval(rawLeft)
	const right = eval(rawRight)
	const leftIsList = left instanceof Array
	const rightIsList = right instanceof Array

	if (!leftIsList && !rightIsList) {
		return Number(left) < Number(right) ? true : Number(left) > Number(right) ? false : undefined
	}

	if (leftIsList && !rightIsList) {
		return validateOrder(`${rawLeft}`, `[${rawRight}]`)
	}
	if (!leftIsList && rightIsList) {
		return validateOrder(`[${rawLeft}]`, `${rawRight}`)
	}

	const leftArray = (left as Array<number | any>).reverse()
	const rightArray = (right as Array<number | any>).reverse()

	do {
		const leftValue = leftArray.pop()
		const rightValue = rightArray?.pop()

		if (leftValue === undefined && rightValue === undefined) {
			return undefined
		}
		if (leftValue === undefined && rightValue !== undefined) {
			return true
		}
		if (leftValue !== undefined && rightValue === undefined) {
			return false
		}

		const compareListValuesResult = validateOrder(leftValue, rightValue)
		if (compareListValuesResult !== undefined) {
			return compareListValuesResult
		}
	} while (true)
}
