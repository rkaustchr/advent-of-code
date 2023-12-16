//
// Pomos: 0.5
//
const util = require('../utils/utils');

const DIRECTION_MASK = {
    UP: 1,
    RIGHT: 1 << 1,
    DOWN: 1 << 2,
    LEFT: 1 << 3,
};

const DIRECTION_MOVE = {
    UP:     { row: -1, col:  0 },
    RIGHT:  { row:  0, col:  1 },
    DOWN:   { row:  1, col:  0 },
    LEFT:   { row:  0, col: -1 },
};

// [ mirror/splitter ][ CURRENT DIRECTION ] => [ NEXT DIRECTION, NEXT DIRECTION ] 
const DIRECTION_CHANGES = {
    // / \ | -
    '.': {
        UP:     [ 'UP' ],
        RIGHT:  [ 'RIGHT' ],
        DOWN:   [ 'DOWN' ],
        LEFT:   [ 'LEFT' ],
    },
    '/': {
        UP:     [ 'RIGHT' ],
        RIGHT:  [ 'UP' ],
        DOWN:   [ 'LEFT' ],
        LEFT:   [ 'DOWN' ],
    },
    '\\': {
        UP:     [ 'LEFT' ],
        RIGHT:  [ 'DOWN' ],
        DOWN:   [ 'RIGHT' ],
        LEFT:   [ 'UP' ],
    },
    '|': {
        UP:     [ 'UP' ],
        RIGHT:  [ 'UP', 'DOWN' ],
        DOWN:   [ 'DOWN' ],
        LEFT:   [ 'UP', 'DOWN' ],
    },
    '-': {
        UP:     [ 'LEFT', 'RIGHT' ],
        RIGHT:  [ 'RIGHT' ],
        DOWN:   [ 'LEFT', 'RIGHT' ],
        LEFT:   [ 'LEFT' ],
    }
}

let grid;
let ROWS;
let COLS;
async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    grid = [];
    for await (const line of linesStream) {
        grid.push( line.split('') );
    }

    ROWS = grid.length;
    COLS = grid[0].length;

    // Brute force all possible start positions
    const starts = []
    for (let r=0; r < ROWS; r++) {
        starts.push([
            { row: r, col: 0 },
            'RIGHT'
        ]);

        starts.push([
            { row: r, col: COLS-1 },
            'LEFT'
        ]);
    }

    for (let c=0; c < COLS; c++) {
        starts.push([
            { row: 0, col: c },
            'DOWN'
        ]);

        starts.push([
            { row: ROWS-1, col: c },
            'UP'
        ]);
    }

    let max = 0;
    while( starts.length > 0) {
        const [ startPos, startDirection ] = starts.pop();
        const energizeds = startBean(startPos, startDirection);
        if ( energizeds > max )
            max = energizeds;
    }

    console.log("Result: %d", max);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function move(pos, direction) {
    return {
        row: pos.row + DIRECTION_MOVE[ direction ].row,
        col: pos.col + DIRECTION_MOVE[ direction ].col
    }
}

function startBean(startPos, startDirection) {
    const tileBeanDirections = {};
    const visitedTiles = new Set();
    const queue = [ [ startPos, startDirection] ];
    while ( queue.length > 0 ) {
        let [ currPos, currDirection ] = queue.pop();
        while ( currPos.row >= 0 && currPos.row < ROWS && currPos.col >= 0 && currPos.col < COLS ) {
            const key = `${currPos.row},${currPos.col}`;
            // mark as visited
            visitedTiles.add( key );
            if ( !tileBeanDirections[ key ] )
                tileBeanDirections[ key ] = 0;
            // if this tile was already visited in the same direction -> cancel
            if ( (tileBeanDirections[ key ] & DIRECTION_MASK[ currDirection ]) > 0 )
                break;
            tileBeanDirections[ key ] |= DIRECTION_MASK[ currDirection ];

            const tileElement = grid[currPos.row][currPos.col];
            const nextDirections = DIRECTION_CHANGES[ tileElement ][ currDirection ];
            // enqueue bifurcation
            if ( nextDirections.length > 1 ) {
                queue.push([
                    move(currPos, nextDirections[1]),
                    nextDirections[1]
                ]);
            }

            currPos = move(currPos, nextDirections[0]);
            currDirection = nextDirections[0];
        }
    }

    return visitedTiles.size;
}