const fs = require('fs');
const readline = require('readline');

function buildValidEdges() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const validEdges = {}

    for(let i=0; i < alphabet.length; i++) {
        const curr = alphabet[ i ];
        validEdges[ curr ] = alphabet.substring(0, i+2);
    }

    // add special edges
    validEdges[ 'S' ] = validEdges[ 'a' ];
    validEdges[ 'y' ] = validEdges[ 'y' ] + 'E';
    validEdges[ 'z' ] = validEdges[ 'z' ] + 'E';

    return validEdges;
}

function getKey(r, c) {
    return `${r},${c}`;
}

function insertOrdered(queue, item) {
    queue.push( item );

    let idx = queue.length-1;
    while ( idx ) {
        // sort by dist 
        if ( queue[ idx ][1] > queue[ idx-1 ][1] ) {
            const tmp = queue[ idx ];
            queue[ idx ] = queue[ idx-1 ];
            queue[ idx-1 ] = tmp;

            idx--;
        } else {
            break;
        }
    }
}

/*
    Different from part 1, in the solution we climb backwards, from the destination(E) and stop when find the fisrt a od S
    Because we climb backward the edge test is checked on the opposite way:
        validEdges[ dest ].includes( currentPos )
*/
function findPath(map, e, validEdges) {
    const visited = {};
    const queue = [ [e, 0] ];
    while (queue.length) {
        const [ p, dist ] = queue.pop();
        if ( visited[ getKey(p[0], p[1]) ] )
            continue;
        visited[ getKey(p[0], p[1]) ] = true;

        if ( 'aS'.includes( map[ p[0] ][ p[1] ] ) )
            return dist;

        const newDist = dist + 1;

        // check neighbors
        // top
        if ( p[0] > 0 && !visited[ getKey(p[0]-1, p[1]) ] && validEdges[ map[ p[0]-1 ][ p[1] ] ].includes( map[ p[0] ][ p[1] ] ) ) {
            insertOrdered(queue, [ [p[0]-1, p[1]], newDist ] )
        }
        // botton
        if ( p[0] < map.length-1 && !visited[ getKey(p[0]+1, p[1]) ] && validEdges[ map[ p[0]+1 ][ p[1] ] ].includes( map[ p[0] ][ p[1] ] ) ) {
            insertOrdered(queue, [ [p[0]+1, p[1]], newDist ])
        }
        // left
        if ( p[1] > 0 && !visited[ getKey(p[0], p[1]-1) ] && validEdges[ map[ p[0] ][ p[1]-1 ] ].includes( map[ p[0] ][ p[1] ] ) ) {
            insertOrdered(queue, [ [p[0], p[1]-1], newDist ])
        }
        // right
        if ( p[1] < map[0].length-1 && !visited[ getKey(p[0], p[1]+1) ] && validEdges[ map[ p[0] ][ p[1]+1 ] ].includes( map[ p[0] ][ p[1] ] ) ) {
            insertOrdered(queue, [ [p[0], p[1]+1], newDist ])
        }
    }
}

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    const validEdges = buildValidEdges();
    const map = [];

    for await (const line of linesStream) {
        map.push( line );
    }
    
    // find end
    let e = null;
    for ( let r=0; r < map.length; r++ ) {
        for ( let c=0; c < map[0].length; c++ ) {
            if ( map[r][c] == "E" ) {
                e = [r, c];
            }
        }
    }

    const steps = findPath(map, e, validEdges);
    
    console.log("Min Steps: %d", steps);
    
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

/* UTILS // */ 
async function getFileStream(path) {
    const fileStream = fs.createReadStream(path);
    return fileStream;
}

async function getFileStreamLines(path) {
    const fileStream = await getFileStream(path);

    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    return rl;
}
/* // UTILS */