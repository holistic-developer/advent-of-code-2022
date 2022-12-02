import * as fs from 'fs';

let rawInput = fs.readFileSync('02-input.txt');
const rounds = rawInput
  .toString()
  .split('\n')
  .map((row) => row.split(' '));


// stage 1
enum Outcome {
  WIN = 6,
  DRAW = 3,
  LOSS = 0
}

function checkOutcome(opponent: string, me: string): Outcome {
  switch (opponent) {
    case 'A' : {
      return me === 'X' ? Outcome.DRAW : me === 'Y' ? Outcome.WIN : Outcome.LOSS;
    }
    case 'B' : {
      return me === 'X' ? Outcome.LOSS : me === 'Y' ? Outcome.DRAW : Outcome.WIN;
    }
    case 'C' : {
      return me === 'X' ? Outcome.WIN : me === 'Y' ? Outcome.LOSS : Outcome.DRAW;
    }
    default:
      return undefined;
  }
}

const totalScore = rounds.map(([opponent, me]) => {
  const choiceScore = me === 'X' ? 1 : me === 'Y' ? 2 : 3;
  const outcomeScore = checkOutcome(opponent, me)
    .valueOf();
  return choiceScore + outcomeScore;
})
  .reduce((a, b) => a + b);

console.log(totalScore);


// stage 2
enum Choice {
  Rock = 1,
  Paper = 2,
  Scissors = 3
}

function calculateChoice(opponent: string, me: Outcome): Choice {
  switch (opponent) {
    case 'A' : {
      return me === Outcome.DRAW ? Choice.Rock : me === Outcome.WIN ? Choice.Paper : Choice.Scissors;
    }
    case 'B' : {
      return me === Outcome.DRAW ? Choice.Paper : me === Outcome.WIN ? Choice.Scissors : Choice.Rock;
    }
    case 'C' : {
      return me === Outcome.DRAW ? Choice.Scissors : me === Outcome.WIN ? Choice.Rock : Choice.Paper;
    }
    default:
      return undefined;
  }
}

const totalScore2 = rounds.map(([opponent, me]) => {
  const outcome = (me === 'X' ? Outcome.LOSS : me === 'Y' ? Outcome.DRAW : Outcome.WIN);
  const outcomeScore = outcome.valueOf();
  const choiceScore = calculateChoice(opponent, outcome)
    .valueOf();
  return choiceScore + outcomeScore;
})
  .reduce((a, b) => a + b);

console.log(totalScore2);