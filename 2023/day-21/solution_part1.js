//
// Pomos: 1
//
const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const map = [];
    for await (const line of linesStream) {
        map.push( line.split('') );
    }

    const ROWS = map.length;
    const COLS = map[0].length;

    let startPos;
    for(let r=0; r < ROWS; r++) {
        for(let c=0; c < COLS; c++) {
            if ( map[r][c] == 'S' ) {
                startPos = [ r, c ];
                map[r][c] = '.';
            }
        }
    }

    const directions = [
        [ -1, 0 ],
        [ 0, 1 ],
        [ 1, 0 ],
        [ 0, -1 ],
    ]

    let currentPositions = new Set( [ getKey(startPos) ] );
    let count = 64;
    while ( count ) {
        const next = new Set();
        for ( const key of currentPositions ) {
            const pos = getPos(key);
            for (const dir of directions) {
                const nextPos = move(pos, dir);
                if ( nextPos[0] < 0 || nextPos[0] == ROWS || nextPos[1] < 0 || nextPos[1] == COLS )
                    continue;
                if ( map[ nextPos[0] ][ nextPos[1] ] == '#' )
                    continue;
                next.add( getKey(nextPos) );
            }
        }
        currentPositions = next;
        count--;
    }
    
    console.log("Result: %d", currentPositions.size);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function getKey(pos) {
    return `${pos[0]},${pos[1]}`;
}

function getPos(key) {
    return key.split(',').map(Number);
}

function move(pos, direction) {
    return [ pos[0] + direction[0], pos[1] + direction[1]  ];
}