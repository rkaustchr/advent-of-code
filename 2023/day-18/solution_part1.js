//
// Pomos: 3
//
const util = require('../utils/utils');

const DIRECTIONS_OFFSET = {
    'U': { r: -1, c:  0 },
    'R': { r:  0, c:  1 },
    'D': { r:  1, c:  0 },
    'L': { r:  0, c: -1 },
}

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const coord = [ [0, 0] ];
    let current = { r:0, c: 0 };
    let minRow = 0;
    let minCol = 0;
    let maxRow = 0;
    let maxCol = 0;
    for await (const line of linesStream) {
        const [ dir, steps, _color ] = line.split(' ');
        for(let i=0; i < +steps; i++) {
            current = move(current, dir);
            coord.push( [ current.r, current.c ] );
            if ( current.r < minRow )
                minRow = current.r
            if ( current.c < minCol )
                minCol = current.c
            if ( current.r > maxRow )
                maxRow = current.r
            if ( current.c > maxCol )
                maxCol = current.c
        }
    }

    const [ rows, cols ] = [ maxRow - minRow + 1, maxCol - minCol + 1 ];
    const grid = new Array(rows)
    for(let i=0; i < rows; i++)
        grid[i] = new Array(cols).fill('?');

    const rowOffset = 0 - minRow;
    const colOffset = 0 - minCol;

    for(let c of coord)
        grid[ c[0] + rowOffset ][ c[1] + colOffset ] = '#';

    // flood the map
    for(let r=0; r < rows; r++) {
        if ( grid[r][0] != '#' )
            flood(grid, rows, cols, [r, 0]);
        if ( grid[r][cols-1] != '#' )
            flood(grid, rows, cols, [r, cols-1]);
    }

    // count the remaining
    let area = 0;
    for(let r=0; r < rows; r++)
        for(let c=0; c < cols; c++)
            if ( grid[r][c] != '.' )
                area++;
    
    console.log("Result: %d", area);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function move(pos, direction) {
    return {
        r: pos.r + DIRECTIONS_OFFSET[direction].r,
        c: pos.c + DIRECTIONS_OFFSET[direction].c,
    }
}

function flood(map, rows, cols, startPos) {
    const queue = [ startPos ];
    while (queue.length > 0) {
        const [ r, c ] = queue.pop();
        if (r < 0 || r == rows || c < 0 || c == cols)
            continue;
        if ( map[r][c] != '?' )
            continue;

        map[r][c] = '.';

        for ( const dir of [ [ -1, 0 ],[ 0, 1 ],[ 1, 0 ],[ 0, -1 ] ] ) {
            const [ nextR, nextC ] = [ r + dir[0], c + dir[1] ];
            if ( nextR < 0 ||  nextR == rows || nextC < 0 || nextC == cols)
                continue;
            if ( map[ nextR ][ nextC ] != '?' )
                continue;
            
            queue.push( [ nextR, nextC ] );
        }
    }
}