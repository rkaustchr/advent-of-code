const fs = require('fs');
const readline = require('readline');

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    const map = [];

    for await (const line of linesStream) {
        map.push( line.split('') );
    }

    const set = new Set();
    
    const maxTop = [];
    const maxBotton = [];
    const maxLeft = [];
    const maxRight = [];

    for(let i=0; i<map.length; i++) {
        maxTop[i] = map[0][i];
        maxBotton[i] = map[map.length-1][i];
        maxLeft[i] = map[i][0];
        maxRight[i] = map[i][map[0].length-1];

        set.add(`0-${i}`);
        set.add(`${map.length-1}-${i}`);
        set.add(`${i}-0`);
        set.add(`${i}-${map[0].length-1}`);
    }

    const queue = [];
    for(let i=1; i<map.length-1; i++) {
        queue.push( [ 1, i, 'B' ] );
        queue.push( [ map.length-2, i, 'T' ] );
        queue.push( [ i, 1, 'R' ] );
        queue.push( [ i, map[0].length-2, 'L' ] );
    }

    while( queue.length ) {
        console.log(queue.length);
        
        const [ r, c, dir ] = queue.pop();
        if ( r < 0 || c < 0 || r >= map.length || c >= map[0].length )
            continue;

        switch ( dir ) {
            case 'B':
                if ( map[r][c] > maxTop[c] ) {
                    console.log("max: %s", maxTop[c])
                    set.add(`${r}-${c}`);
                    maxTop[c] = map[r][c];
                }
                queue.push([ r+1, c, 'B' ])
                break;
            case 'T':
                if ( map[r][c] > maxBotton[c] ) {
                    console.log("max: %s", maxBotton[c])
                    set.add(`${r}-${c}`);
                    maxBotton[c] = map[r][c];
                }
                queue.push([ r-1, c, 'T' ])
                break;
            case 'R':
                if ( map[r][c] > maxLeft[r] ) {
                    console.log("max: %s", maxLeft[r])
                    set.add(`${r}-${c}`);
                    maxLeft[r] = map[r][c];
                }
                queue.push([ r, c+1, 'R' ])
                break;
            case 'L':
                if ( map[r][c] > maxRight[r] ) {
                    console.log("max: %s", maxRight[r])
                    set.add(`${r}-${c}`);
                    maxRight[r] = map[r][c];
                }
                queue.push([ r, c-1, 'L' ])
                break;
        }
    }

    console.log("Total: %d", set.size);
    
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