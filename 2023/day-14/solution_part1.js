//
// Pomos: 0.5
//
const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const platform = [];
    for await (const line of linesStream) {
        platform.push( line.split('') );
    }

    // move the rocks
    for(let r=0; r < platform.length; r++) {
        for(let c=0; c < platform[0].length; c++) {
            if ( platform[r][c] != 'O' )
                continue;
            let k = r-1;
            while( k >= 0 && platform[k][c] == '.' )
                k--;
            platform[r][c] = '.';
            platform[k+1][c] = 'O';
        }
    }

    // count the load
    let totalLoad = 0;
    const size = platform.length;
    for(let r=0; r < platform.length; r++) {
        for(let c=0; c < platform[0].length; c++) {
            if ( platform[r][c] != 'O' )
                continue;
            totalLoad += size - r;
        }
    }
    
    console.log("Result: %d", totalLoad);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();