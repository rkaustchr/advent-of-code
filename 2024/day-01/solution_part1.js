const util = require('./../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let sum = 0;
    let arr1 = [];
    let arr2 = [];

    // load arrays
    let num1, num2;
    for await (const line of linesStream) {
        [ num1, num2 ] = line.split("   ").map(x => +x);
        arr1.push(num1);
        arr2.push(num2);
    }

    // sort arrays
    arr1.sort((a, b) => a - b);
    arr2.sort((a, b) => a - b);

    // calc the diff
    let diff = 0;
    for(let i=0; i < arr1.length; i++) {
        diff += Math.abs( arr2[i] - arr1[i] );
    }
    
    console.log("The sum is: %d", diff);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();
