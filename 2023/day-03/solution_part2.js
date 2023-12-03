const util = require('../utils/utils');

const digitSet = new Set([ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ]);
const matrix = [];
let nrows, ncols;

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    for await (const line of linesStream) {
        matrix.push( line.split('') );
    }

    [ nrows, ncols ] = [ matrix.length, matrix[0].length ];

    let sum = 0;
    let numbers;
    for (let r=0; r < matrix.length; r++) {
        for (let c=0; c < matrix[0].length; c++) {
            if ( matrix[r][c] != '*' )
                continue;
            
            numbers = findNumbers(r, c);
            if (numbers.length == 2)
                sum += numbers[0] * numbers[1];
        }
    }
    
    console.log("Result: %d", sum);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function findNumbers(row, col) {
    const minRow = Math.max(0, row-1);
    const maxRow = Math.min(nrows-1, row+1);
    const minCol = Math.max(0, col-1);
    const maxCol = Math.min(ncols-1, col+1);

    const numbers = [];
    for (let r=minRow; r <= maxRow; r++) {
        for(let c=minCol; c<= maxCol; c++) {
            if ( !isDigit(matrix[r][c]) )
                continue;

            numbers.push( buildNumber(r, c) );
        }
    }

    return numbers;
}

function buildNumber(r, c) {
    let startIdx = c;
    while ( startIdx >= 0 && isDigit( matrix[r][startIdx] ))
        startIdx--;

    startIdx++;
    let number = '';
    while ( startIdx < ncols && isDigit( matrix[r][startIdx])) {
        number = `${number}${matrix[r][startIdx]}`;
        matrix[r][startIdx] = '.'; 
        startIdx++;
    }
    
    return parseInt(number);
}

function isDigit( char ) {
    return digitSet.has(char);
}
