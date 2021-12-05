const fs = require("fs");
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const R = 0; // row
const C = 1; // col

let size = 1000; // initial matrix dimensions
//let matrix = new Array(size).fill( new Array(size).fill(0) );
let matrix = [];
for (let i=0; i < size; i++) {
    matrix[i] = [];
    for(let j=0; j < size; j++) {
        matrix[i][j] = 0;
    }
}

for( let line of input) {
    if (line.length == 0) continue;

    let points = line.split(' -> ');
    let pointA = points[0].split(',').map(p => parseInt(p));
    let pointB = points[1].split(',').map(p => parseInt(p));

    if (pointA[R] != pointB[R] && pointA[C] != pointB[C])
        continue;

    let initialRow = pointA[R];
    let initialCol = pointA[C];
    while ( initialRow != pointB[R] || initialCol != pointB[C] ) {
        matrix[initialRow][initialCol]++;

        if ( initialRow < pointB[R] ) initialRow++;
        if ( initialRow > pointB[R] ) initialRow--;
        if ( initialCol < pointB[C] ) initialCol++;
        if ( initialCol > pointB[C] ) initialCol--;
    }

    matrix[pointB[R]][pointB[C]]++;
}

// counting
let count = 0;
for (let r=0; r < size; r++) {
    for (let c=0; c < size; c++) {
        if (matrix[r][c] > 1) count++;
    }
}

console.log(` Count ${count} `);