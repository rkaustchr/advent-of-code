const util = require('../utils/utils');

const dirDict = {
    // source: [ [ row, col] to [ row, col ] ]
    '|': [ [-1, 0], [1, 0] ],
    '-': [ [0, -1], [0, 1] ],
    'L': [ [-1, 0], [0, 1] ],
    'J': [ [0, -1], [-1, 0] ],
    '7': [ [0, -1], [1, 0] ],
    'F': [ [0, 1], [1, 0] ],
    '.': [ ],
}

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const matrix = [];
    for await (const line of linesStream) {
        matrix.push( line.split('') );
    }

    const [ start, graph ] = buildGraph(matrix);

    // BFS on the start node
    let steps = 0;
    let queue = [ [ start, 0 ] ]; // [ node , distance ]
    const visited = new Set();
    while ( queue.length ) {
        const [ node, dst ] = queue.shift();
        if ( dst > steps )
            steps = dst;
        if ( visited.has( node ) )
            continue;
        visited.add( node );
        for (const neighbor of graph[ node ] ) {
            if ( visited.has( neighbor ) )
                continue;
            queue.push( [ neighbor, dst + 1 ] );
        }
    }
    
    console.log("Result: %d", steps);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function buildGraph(matrix) {
    const graph = {};
    let start = '';
    for (let row=0; row < matrix.length; row++) {
        for(let col=0; col < matrix[0].length; col++) {
            if ( matrix[row][col] == '.' )
                continue;
            if ( matrix[row][col] == 'S') {
                start = getNodeKey(row, col);
                if ( !graph[ start ] )
                    graph[ start ] = new Set();

                // test all 4 directions to find wich connections are compatible
                // LEFT
                for (const dir of dirDict[matrix[row][col-1]]) {
                    // [0, 1]
                    if ( dir[0] == 0 && dir[1] == 1 )
                        graph[ start ].add( getNodeKey( row, col - 1 ) );
                }
                // UP
                for (const dir of dirDict[matrix[row-1][col]]) {
                    // [1, 0]
                    if ( dir[0] == 1 && dir[1] == 0 )
                        graph[ start ].add( getNodeKey( row - 1, col ) );
                }
                // RIGHT
                for (const dir of dirDict[matrix[row][col+1]]) {
                    // [0, -1]
                    if ( dir[0] == 0 && dir[1] == -1 )
                        graph[ start ].add( getNodeKey( row, col + 1 ) );
                }
                // DOWN
                for (const dir of dirDict[matrix[row+1][col]]) {
                    // [-1, 0]
                    if ( dir[0] == -1 && dir[1] == 0 )
                        graph[ start ].add( getNodeKey( row + 1, col ) );
                }

                continue;
            }

            const node = getNodeKey(row, col);
            if ( !graph[ node ] )
                graph[ node ] = new Set();
            const dirs = dirDict[matrix[row][col]];
            for(const dir of dirs) {
                const dest = getNodeKey( row + dir[0], col + dir[1] );
                graph[ node ].add( dest );
            }
        }
    }
    return [ start, graph ];
}

function getNodeKey(row, col) {
    return `${row}_${col}`;
}