//
// Pomos: 2,5
//
const fs = require('fs');

async function main() {
    const file = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const blocks = file.split('\n\n');

    let total = 0;
    for(const block of blocks) {
        const map = block.split("\n");

        // build columns
        const columns = [];
        for (let i=0; i < map[0].length; i++) {
            let column = "";
            for (let j=0; j < map.length; j++) {
                column += map[j][i];
            }
            columns.push(column);
        }

        // original inflection
        const [ direction, idx ] = findInflection(map, columns);

        // get the candidates ( diff == 1 )
        // rows
        let found = false;
        for (let i=0; i < map.length-1; i++) {
            for (let j=i+1; j < map.length; j++) {
                const smudge = smudgePos(map[i], map[j]);
                if ( smudge == -1 )
                    continue;

                let midPoint = (j+i)/2;
                // has to be an even distance row
                if ( midPoint == Math.trunc(midPoint) )
                    continue;
                midPoint = Math.trunc(midPoint)

                // cannot be the original inflection
                if ( direction == 'r' && idx == midPoint )
                    continue;

                let tmp = map[i];
                const s = map[i].split('');
                s[smudge] = map[j][smudge];
                map[i] = s.join('');
                if ( isInflection(map, midPoint) ) {
                    found = true;
                    total += 100 * (midPoint+1);
                    break;
                }

                map[i] = tmp;
            }

            if ( found )
                break;
        }

        if ( found )
            continue;

        // try columns
        for (let i=0; i < columns.length-1; i++) {
            for (let j=i+1; j < columns.length; j++) {
                const smudge = smudgePos(columns[i], columns[j]);
                if ( smudge == -1 )
                    continue;

                let midPoint = (j+i)/2;
                if ( midPoint == Math.trunc(midPoint) )
                    continue;
                midPoint = Math.trunc(midPoint)

                if ( direction == 'c' && idx == midPoint )
                    continue;

                let tmp = columns[i];
                const s = columns[i].split('');
                s[smudge] = columns[j][smudge];
                columns[i] = s.join('');
                if ( isInflection(columns, midPoint) ) {
                    total += midPoint + 1;
                    break;
                }

                columns[i] = tmp;
            }
        }
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function findInflection(rowMatrix, colMatrix) {
    // first try lines
    for (let i=0; i < rowMatrix.length-1; i++)
        if ( rowMatrix[i] == rowMatrix[i+1] && isInflection( rowMatrix, i) )
            return [ 'r', i ];

    // try columns
    for (let i=0; i < colMatrix.length-1; i++)
        if ( colMatrix[i] == colMatrix[i+1] && isInflection( colMatrix, i) )
            return [ 'c', i ];
}

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

function smudgePos(a, b) {
    let pos = -1;
    for(let i=0; i < a.length; i++) {
        if (a[i] != b[i])
            if (pos == -1)
                pos = i;
            else
                return -1;
    }
    return pos;
}