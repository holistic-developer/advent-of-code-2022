import * as fs from 'fs';
import {isNumberObject} from 'util/types';
import {inflate} from "zlib";

let rawInput = fs.readFileSync('08-input.txt');
const input = rawInput
    .toString()
    .split('\n')
    .map(line => line.split('').map(Number));

// stage 1

const sizeY = input.length;
const sizeX = input[0].length;
const visible = new Array(sizeY).fill(false).map(() => new Array(sizeX).fill(false));

const setVisibleLine = (
    getHeight: (i: number) => number,
    setVisible: (i: number) => void,
    lineLenght: number) => {
    let maxHeightSoFar = -1;
    for (let i = 0; i < lineLenght; i++) {
        if (getHeight(i) > maxHeightSoFar) {
            setVisible(i);
        }
        maxHeightSoFar = Math.max(maxHeightSoFar, getHeight(i));
    }
}

// left to right
for (let y = 0; y < sizeY; y++) {
    setVisibleLine((x) => input[y][x],
        (x) => visible[y][x] = true,
        sizeX);
}

// Right to left
for (let y = 0; y < sizeY; y++) {
    setVisibleLine((x) => input[y][sizeX - 1 - x],
        (x) => visible[y][sizeX - 1 - x] = true,
        sizeX);
}


// Top to bottom
for (let x = 0; x < sizeX; x++) {
    setVisibleLine((y) => input[y][x],
        (y) => visible[y][x] = true,
        sizeY);
}

// Bottom to top
for (let x = 0; x < sizeX; x++) {
    setVisibleLine((y) => input[sizeY - 1 - y][x],
        (y) => visible[sizeY - 1 - y][x] = true,
        sizeY);
}

console.log(visible
    .map(line => line.map(v => v ? 1 : 0)
        .map(Number)
        .reduce((a, b) => a + b))
    .reduce((a, b) => a + b))

// stage 2
const getViewDistance = (
    getHeight: (i: number) => number,
    maxDistance: number) => {
    if (maxDistance == 0) {
        return 0;
    }
    const initialHeight = getHeight(0);
    let viewDistance = 0;
    do {
        viewDistance++;
        if (getHeight(viewDistance) >= initialHeight) {
            break;
        }
    } while (viewDistance < maxDistance);
    return viewDistance
}

const scenicScores = new Array(sizeY).fill(false).map(() => new Array(sizeX).fill(0));
for (let y = 1; y < sizeY - 1; y++) {
    for (let x = 1; x < sizeX - 1; x++) {
        const right = getViewDistance((i) => input[y][x + i], sizeX - x - 1)
        const left = getViewDistance((i) => input[y][x - i], x)
        const down = getViewDistance((i) => input[y + i][x], sizeY - y - 1)
        const up = getViewDistance((i) => input[y - i][x], y)
        scenicScores[y][x] = left * right * up * down;
    }
}

console.log(Math.max(...scenicScores.flat()));


