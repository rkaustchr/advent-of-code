//
// Pomos: 2
//
const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const map = [];
    for await (const line of linesStream)
        map.push( line.split('') );
    
    const graph = buildGraph( map );
    const start = getKey( [ 0, 1 ] );
    const end = getKey( [ map.length-1, map[0].length-2 ] );

    const count = search(graph, start, end);
    
    console.log("Result: %d", count);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function search(graph, start, end, visited = new Set()) {
    let count = 0;
    let current = start;
    while ( current != end ) {
        count++;
        visited.add( current );
        const adj = graph[ current ].adj.filter(x => !visited.has(x));

        // if it's a dead end return;
        if ( adj.length == 0 )
            return 0;

        // if it's a bifurcation, explore all paths
        if ( adj.length > 1 ) {
            let localMax = 0;
            for(const x of adj) {
                const localCount = search(graph, x, end, new Set( visited ));
                if ( localCount > localMax )
                    localMax = localCount;
            }
            return count + localMax;
        }

        // regular path, just keep going
        current = adj[0];
    }

    return count;
}

function buildGraph( map ) {
    const graph = {};
    for(let r=0; r < map.length; r++) {
        for(let c=0; c < map[0].length; c++) {
            if ( map[r][c] == '#' )
                continue;
            graph[ getKey( [ r, c ] ) ] = {
                adj: [],
            }
        }
    }

    for(let r=0; r < map.length - 1; r++) {
        for(let c=0; c < map[0].length - 1; c++) {
            if ( map[r][c] == '#' )
                continue;
            if ( map[r][c] == '^' )
                continue;
            if ( map[r][c] == '<' )
                continue;

            if ( map[r][c] == '.' ) {
                const key = getKey([ r, c ]);
                // DOWN
                if ( map[r+1][c] == '.' ) {
                    const adjKey = getKey([ r+1, c ]);
                    graph[key].adj.push( adjKey );
                    graph[adjKey].adj.push( key );
                }
                if ( 'v><'.includes( map[r+1][c] ) ) {
                    const adjKey = getKey([ r+1, c ]);
                    graph[key].adj.push( adjKey );
                }
                if ( map[r+1][c] == '^' ) {
                    const adjKey = getKey([ r+1, c ]);
                    graph[adjKey].adj.push( key );
                }

                // RIGHT
                if ( map[r][c+1] == '.' ) {
                    const adjKey = getKey([ r, c+1 ]);
                    graph[key].adj.push( adjKey );
                    graph[adjKey].adj.push( key );
                }
                if ( 'v>^'.includes(map[r][c+1]) ) {
                    const adjKey = getKey([ r, c+1 ]);
                    graph[key].adj.push( adjKey );
                }
                if ( map[r][c+1] == '<' ) {
                    const adjKey = getKey([ r, c+1 ]);
                    graph[adjKey].adj.push( key );
                }
            }

            if ( map[r][c] == '>' ) {
                const key = getKey([ r, c ]);
                // RIGHT
                if ( map[r][c+1] != '#' ) {
                    const adjKey = getKey([ r, c+1 ]);
                    graph[key].adj.push( adjKey );
                }
            }

            if ( map[r][c] == 'v' ) {
                const key = getKey([ r, c ]);
                // DOWN
                if ( map[r+1][c] != '#' ) {
                    const adjKey = getKey([ r+1, c ]);
                    graph[key].adj.push( adjKey );
                }
            }  
        }
    }

    return graph;
}

function getKey( pos ) {
    return `${pos[0]},${pos[1]}`;
}