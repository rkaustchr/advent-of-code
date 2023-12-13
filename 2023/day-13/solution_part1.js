//
// Pomos: 1.5
//
const fs = require('fs');

async function main() {
    const file = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const blocks = file.split('\n\n');

    let total = 0;
    for(const block of blocks) {
        const map = block.split("\n");

        // first try lines
        let found = false;
        for (let i=0; i < map.length-1; i++) {
            if ( map[i] == map[i+1] && isInflection( map, i) ) {
                found = true;
                total += 100 * (i+1);
                break;
            }
        }

        if (found)
            continue;

        // try columns
        const columns = [];
        for (let i=0; i < map[0].length; i++) {
            let column = "";
            for (let j=0; j < map.length; j++) {
                column += map[j][i];
            }
            columns.push(column);
        }
        for (let i=0; i < columns.length-1; i++) {
            if ( columns[i] == columns[i+1] && isInflection( columns, i) ) {
                total += (i+1);
                break;
            }
        }
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function isInflection(arrs, midPoint) {
    let [ s, e ] = [ midPoint, midPoint+1 ];
    while ( s >= 0 && e < arrs.length) {
        if ( arrs[s] != arrs[e] )
            return false;
        s--;
        e++;
    }
    return true;
}