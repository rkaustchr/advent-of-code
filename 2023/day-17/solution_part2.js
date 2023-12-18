//
// Pomos: 0.2
//
const util = require('../utils/utils');
const { PriorityQueue } = require('./ds/priorityQueue');

const OPPOSITE_DIR = {
    'UP': 'DOWN',
    'RIGHT': 'LEFT',
    'DOWN': 'UP',
    'LEFT': 'RIGHT'
};

const DIRECTION_MOVE = {
    'UP':    { r: -1, c: 0 },
    'RIGHT': { r: 0, c: 1 },
    'DOWN':  { r: 1, c: 0 },
    'LEFT':  { r: 0, c: -1 }
}

let ROWS;
let COLS;
const map = [];
const visiteds = new Set();

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    for await (const line of linesStream) {
        map.push( line.split('').map(Number) );
    }
    ROWS = map.length;
    COLS = map[0].length;

    const minHeap = new PriorityQueue((a, b) => a.heatLoss - b.heatLoss);
    // insert the 2 initial states
    // right
    minHeap.push(new State(map[0][1], { r:0, c:1 }, 'RIGHT', 2));
    // down
    minHeap.push(new State(map[1][0], { r:1, c:0 }, 'DOWN', 2));

    let minHeatLoss;
    while( !minHeap.isEmpty() ) {
        const state = minHeap.pop();

        if ( state.pos.r == ROWS-1 && state.pos.c == COLS-1 && state.strike > 3) {
            // found final
            minHeatLoss = state.heatLoss;
            break;
        }
        
        const branches = state.branch();
        for (const b of branches)
            minHeap.push(b);
    }
    
    console.log("Result: %d", minHeatLoss);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function getKey(pos) {
    return `${pos.r},${pos.c}`;
}

function move(pos, direction) {
    return {
        r: pos.r + DIRECTION_MOVE[direction].r,
        c: pos.c + DIRECTION_MOVE[direction].c,
    }
}

class State {
    constructor(heatLoss, pos, direction, strike) {
        this.heatLoss = heatLoss;
        this.pos = pos;
        this.direction = direction;
        this.strike = strike;
    }

    key() {
        return `${getKey(this.pos)}_${this.direction}_${this.strike}`;
    }

    branch() {
        if ( visiteds.has( this.key() ) )
            return [];
        visiteds.add( this.key() );

        const branches = [];
        for(const dir of [ 'UP', 'RIGHT', 'DOWN', 'LEFT' ]) {
            if ( this.strike < 4 && dir != this.direction )
                continue;
            if ( dir == OPPOSITE_DIR[ this.direction ] )
                continue;
            if ( dir == this.direction && this.strike == 10 )
                continue;

            const newPos = move(this.pos, dir);
            if (newPos.r < 0 || newPos.r == ROWS || newPos.c < 0 || newPos.c == COLS)
                continue;

            const newStatus = new State( 
                this.heatLoss + map[newPos.r][newPos.c],
                newPos,
                dir,
                dir == this.direction ? this.strike + 1 : 1
            );

            if ( visiteds.has( newStatus.key() ) )
                continue;

            branches.push(newStatus);
        }

        return branches;
    }
}