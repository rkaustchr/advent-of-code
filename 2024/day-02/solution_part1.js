const util = require('./../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let totalSafe = 0;

    let level;
    for await (const line of linesStream) {
        level = line.split(" ").map(x => +x);
        
        if (isSafe(level))
            totalSafe++;
    }
  
    console.log("The total safe leves: %d", totalSafe);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

function isSafe(arr) {
    let prev = arr[0];
    const dir = direction(arr[0], arr[1]);

    for (let i=1; i < arr.length; i++) {
        if ( dir == direction(arr[i-1], arr[i]) && isValidDistance(arr[i-1], arr[i]) )
            continue;
        return false;
    }

    return true;
}

function direction(a, b) {
    return (a - b) >= 0;
}

function isValidDistance(a, b) {
    const diff = Math.abs( a - b );
    return diff > 0 && diff < 4;
}

main();
