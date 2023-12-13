//
// Pomos: 2
//
const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let total = 0;
    for await (const line of linesStream) {
        const [ patternStr, groupsStr ] = line.split(' ');
        const pattern = patternStr.split('');
        const groups = groupsStr.split(',').map(Number);
        total += valids(pattern, 0, groups);
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function valids(pattern, idx, groups) {
    let total = 0;
    while ( idx < pattern.length && pattern[ idx ] != '?' )
        idx++;

    if ( idx == pattern.length )
        return isMatch(pattern, groups) ? 1 : 0;

    // choose between damaged or not
    pattern[ idx ] = '#';
    total += valids(pattern, idx + 1, groups);
    pattern[ idx ] = '.';
    total += valids(pattern, idx + 1, groups);
    pattern[ idx ] = '?';

    return total;
}

function isMatch(pattern, groups) {
    const patternGroup = [];
    let count = 0;
    for(let i=0; i < pattern.length; i++) {
        if ( pattern[ i ] == '#' ) {
            count++;
        } else {
            if (count > 0)
                patternGroup.push(count);
            count = 0;
        }
    }
    if (count > 0)
        patternGroup.push(count);

    if ( groups.length != patternGroup.length )
        return false;

    for (let i=0; i < groups.length; i++)
        if ( groups[i] != patternGroup[i] )
            return false;

    return true;
}