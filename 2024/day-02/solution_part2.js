const util = require('./../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let totalSafe = 0;

    let level;
    for await (const line of linesStream) {
        level = line.split(" ").map(x => +x);

        if (isSafe(level) || isSafe(level, 1, false))
            totalSafe++;
    }
  
    console.log("The total safe leves: %d", totalSafe);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

function isSafe(arr, startIdx = 0, errorsLeft = true, direction = null) {
    // the last item isolated is always valid
    if ( startIdx >= arr.length - 1 )
        return true;

    // try with next
    if ( isValidDistance(arr[startIdx], arr[startIdx+1]) ) {
        const currDir = getDirection(arr[startIdx], arr[startIdx+1]);
        if ( currDir == direction || direction == null ) {
            const result = isSafe(arr, startIdx+1, errorsLeft, currDir);
            if (result)
                return true;
        }
    }

    // skip next
    if (errorsLeft) {
        if ( startIdx+2 >= arr.length )
            return true;

        if ( isValidDistance(arr[startIdx], arr[startIdx+2]) ) {
            const currDir = getDirection(arr[startIdx], arr[startIdx+2]);
            if ( currDir == direction || direction == null )
                return isSafe(arr, startIdx+2, false, currDir);
        }
    }

    return false;
}

function getDirection(a, b) {
    return (a - b) >= 0;
}

function isValidDistance(a, b) {
    const diff = Math.abs( a - b );
    return diff > 0 && diff < 4;
}

main();
