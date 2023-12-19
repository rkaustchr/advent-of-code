//
// Pomos: 5
//
const util = require('../utils/utils');

const DIRECTIONS_OFFSET = {
    'U': { r: -1, c:  0 },
    'R': { r:  0, c:  1 },
    'D': { r:  1, c:  0 },
    'L': { r:  0, c: -1 },
}

const CODE_MAP = {
    '0': 'R', 
    '1': 'D', 
    '2': 'L',
    '3': 'U',
}

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const coords = [ [0, 0] ];
    let boundary = 0;
    let current = { r:0, c: 0 };
    for await (const line of linesStream) {
        const [ _dir, _steps, color ] = line.split(' ');
        const [ dir, steps ] = parseColor(color);

        for(let i=0; i < steps; i++) {
            current = move(current, dir);
            boundary++;
        }
        coords.push( [ current.r, current.c ] );
    }

    // Shoelace algorith to compute the area
    //  A = 1/2 sum( (y_(i) + y_(i+1))(x_(i) - x_(i+1)) ), for i = 1..n  // trapezoide method
    //  A = 1/2 sum( (x_(i) * y_(i+1)) - (x_(i+1) * y_(i)) ), for i = 1..n  // determinant method
    let sum = 0;
    for(let i=0; i < coords.length-1; i++) {
        sum += (coords[i][1] + coords[i+1][1]) * (coords[i][0] - coords[i+1][0]) // trapezoide method
        //sum += (coords[i][0] * coords[i+1][1]) - (coords[i+1][0] * coords[i][1]) // determinant method
    }

    // area is negative if we apply the algorithm in a clockwise way
    const area = Math.abs(sum / 2);

    // Pick's Theorem
    //  i -> num internal points
    //  b -> num boundary points
    const b = boundary;
    const i = area + 1 - (b/2);
    const total = i + b;
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function parseColor(color) {
    const steps = parseInt(color.substring(2, 7), 16);
    const dir = color.substring(7, 8);
    return [ CODE_MAP[dir], steps ];
}

function move(pos, direction) {
    return {
        r: pos.r + DIRECTIONS_OFFSET[direction].r,
        c: pos.c + DIRECTIONS_OFFSET[direction].c,
    }
}