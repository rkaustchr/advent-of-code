const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const map = [];
    for await (const line of linesStream) {
        map.push( line.split('') );
    }

    let total = 0;
    for(let r=0; r < map.length; r++) {
        for (let c=0; c < map[r].length; c++) {
            if (map[r][c] == 'X') {
                total += search(map, "XMAS", r, c);
            }
        }
    }

    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

function search(map, word, row, col) {
    const directions = [
        [ 0, 1 ], // horizontal to right
        [ 0, -1 ], // horizontal to left

        [ 1, 0 ], // vertical to botton
        [ -1, 0 ], // vertical to top
        
        [ -1, -1 ], // diagonal to top left
        [ -1, 1 ], // diagonal to top right
        [ 1, -1 ], // diagonal to botton left
        [ 1, 1 ], // diagonal to botton right
    ];

    let count = 0;
    for ( const dir of directions ) {
        if (canCompleteWord(map, row, col, dir, word))
            count++; 
    }

    return count;
}

function canCompleteWord(map, row, col, direction, word) {
    let wordIdx = 0;
    let [r, c] = [ row, col ];
    while ( wordIdx < word.length ) {
        if(!isValidPosition(map, r, c) || word[wordIdx] != map[r][c] )
            return false;
        wordIdx++;
        r += direction[0];
        c += direction[1];
    }
    return true;
}

function isValidPosition(map, row, col) {
    return (row >= 0 && row < map.length) && (col >= 0 && col < map[0].length);
}

main();