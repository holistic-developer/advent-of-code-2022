import * as fs from 'fs';
import { isNumberObject } from 'util/types';

let rawInput = fs.readFileSync('07-input.txt');
const input = rawInput
  .toString()
  .split('\n');

// stage 1

function currentPath() {
  return wd.join('/')
    .substring(1) + '/';
}

const fileTree = new Map<string, string[] | number>();

const wd = [];
input.forEach((line) => {

  if (line.startsWith('$ cd')) {
    if (line.endsWith('..')) {
      wd.pop();
    } else {
      wd.push(line.substring(5, line.length));
    }
  }

  if (line.startsWith('$ ls')) {
    fileTree.set(currentPath(), []);
  }

  if (line.startsWith('dir')) {
    const subFolder = currentPath() + line.substring(4, line.length) + '/';
    (fileTree.get(currentPath()) as string[]).push(subFolder);
  }

  if (line.match(/^\d+/)) {
    const [size, name] = line.split(' ');
    const filePath = currentPath() + name;
    (fileTree.get(currentPath()) as string[]).push(filePath);
    fileTree.set(filePath, Number(size));
  }
});

const allSizes = new Map<string, number>();

function calculateFolderSize(currentFolder: any) {
  let totalSize = 0;
  const fileSizeOrFolder = fileTree.get(currentFolder);
  if (Number.isInteger(fileSizeOrFolder)) {
    totalSize = fileSizeOrFolder as number;
  } else {
    (fileSizeOrFolder as string[]).forEach(
      (fileOrFolder) => {
        totalSize += calculateFolderSize(fileOrFolder);
      },
    );
  }
  allSizes.set(currentFolder, totalSize);
  return totalSize;
}

calculateFolderSize('/');

console.log(
  Array.from(allSizes)
    .filter(([p, v]) => p.endsWith('/') && v <= 100000)
    .map(([_, v]) => v)
    .reduce((a, b) => a + b));

// stage 2
const TOTAL_DISKSPACE = 70000000;
const remaining = TOTAL_DISKSPACE - allSizes.get('/');
const required = 30000000 - remaining;

console.log(
  Math.min(
    ...Array.from(allSizes)
      .filter(([p, v]) => p.endsWith('/') && v >= required)
      .map(([_, v]) => v),
  ),
);