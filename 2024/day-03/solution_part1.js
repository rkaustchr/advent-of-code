const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const regex = /mul\((\d{1,3}),(\d{1,3})\)/g
    let total = 0;

    for await (const line of linesStream) {
        const regexResult = [ ...line.matchAll(regex) ];
        for(let [ _match, num1, num2 ] of regexResult) {
            total += (+num1) * (+num2);
        }
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();