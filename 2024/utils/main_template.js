const util = require('./../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    for await (const line of linesStream) {
        // pass
    }
    
    console.log("Result: %d", 1);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();
