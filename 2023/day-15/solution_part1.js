//
// Pomos: 0.5
//
const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let instructions = [];
    for await (const line of linesStream) {
        instructions = line.split(',');
    }

    let total = 0;
    for(const str of instructions) {
        total += hash(str);
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function hash(str) {
    let res = 0;
    for(let i=0; i < str.length; i++) {
        res += str.charCodeAt(i);
        res *= 17;
        res %= 256;
    }
    return res;
}