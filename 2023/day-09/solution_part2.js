const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let total = 0;
    for await (const line of linesStream) {
        const nums = line.split(' ').map(Number);
        total += proccess(nums)
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function proccess(arr) {
    const firstElems = [  ];
    let isAllZero;
    do {
        firstElems.push( arr[ 0 ] );
        isAllZero = true;
        const next = [];
        for (let i=0; i < arr.length - 1; i++) {
            const diff = arr[i+1] - arr[i];
            next.push(diff);
            if (diff != 0)
                isAllZero = false;
        }
        arr = next;
    } while (!isAllZero);

    // extrapolates
    let nextVal = 0;
    while ( firstElems.length )
        nextVal = firstElems.pop() - nextVal;

    return nextVal;
}