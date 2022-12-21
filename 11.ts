import * as fs from 'fs'

let rawInput = fs.readFileSync('11-input.txt')
const input = rawInput.toString()

// stage 1

type Monkey = {
	items: number[]
	operation: string
	test: number
	trueMonkeyIndex: number
	falseMonkeyIndex: number
	inspections: number
}

function parseMonkeys(input: string): Monkey[] {
	return input.split('\n\n').map((monkeyDescription) => {
		const [name, items, op, test, trueId, falseId] = monkeyDescription.split('\n')
		return {
			items: items.split(': ')[1].split(', ').map(Number),
			operation: op.split('= ')[1],
			test: Number(test.split(' ').pop()),
			trueMonkeyIndex: Number(trueId.split(' ').pop()),
			falseMonkeyIndex: Number(falseId.split(' ').pop()),
			inspections: 0,
		}
	})
}

const playOneRound = (monkeys: Monkey[], relieve: number) => {
	for (const monkey of monkeys) {
		while (monkey.items.length > 0) {
			monkey.inspections++
			let old = monkey.items.reverse().pop()
			monkey.items.reverse()
      let worryLevel = eval(monkey.operation)
      worryLevel = Math.floor(worryLevel / relieve)
      worryLevel %= monkeys.map(m => m.test).reduce((a, b) => a*b)
			if (worryLevel % monkey.test === 0) {
				monkeys[monkey.trueMonkeyIndex].items.push(worryLevel)
			} else {
				monkeys[monkey.falseMonkeyIndex].items.push(worryLevel)
			}
		}
	}
}

const getMonkeyBusiness = (monkeys: Monkey[]): number => {
	const [top, second] = monkeys.map((m) => m.inspections).sort((a, b) => b - a)
	return top * second
}

let monkeys = parseMonkeys(input)
for (let i = 0; i < 20; i++) {
	playOneRound(monkeys, 3)
}
console.log(getMonkeyBusiness(monkeys))

// stage 2
monkeys = parseMonkeys(input)
for (let i = 0; i < 10000; i++) {
	playOneRound(monkeys, 1)
}
console.log(getMonkeyBusiness(monkeys))
