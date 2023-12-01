const util = require('./../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let sum = 0;
    let num;
    for await (const line of linesStream) {
        num = line.replace(/[^0-9]/g, "");
        if (num.length < 1)
            continue;
        num = parseInt( `${num[0]}${num[num.length-1]}` );
        sum += num
    }
    
    console.log("The sum is: %d", sum);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();
